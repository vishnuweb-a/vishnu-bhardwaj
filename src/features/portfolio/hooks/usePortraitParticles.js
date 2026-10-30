import { useEffect, useRef, useState } from 'react';
import { shouldReduceMotion } from '@/animations/utils/animationUtils';

// Canvas particle rendering of the hero portrait. Animation state lives in
// typed arrays inside the effect, never in React state; the only state is
// `ready`, flipped once so the fallback <img> can hide behind the canvas.
// This is a physics simulation, not a tween, so it deliberately bypasses the
// Anime.js preset pipeline (CLAUDE.md 8) - it still honours reduced motion.

const RADIUS = 32; // CSS px
const DOT = 1.8; // CSS px
const MAX_PARTICLES = 30000;
const MAX_DPR = 2;
const LEVELS = 32;

// Units are CSS px and seconds, integrated at a fixed step, so tuning does not
// depend on display refresh rate. SPRING and DAMP are near critical damping
// (omega ~ 11 rad/s): ~80% home by 300 ms, ~98% by 600 ms, no ringing.
const STEP = 1 / 120;
const MAX_FRAME = 0.05; // clamp after a suspended tab
const SPRING = 121;
const DAMP = 20;
const PUSH = 1400; // px/s^2 at the cursor centre
const SWEEP = 1.1; // acceleration per px/s of cursor speed
const TANGENT = 0.3; // sideways share of the radial push
const MAX_POINTER_V = 1200; // px/s
const MAX_V = 500; // px/s, per particle
const STALE_MS = 50; // no movement for this long means the cursor is still
const SNAP_D = 0.15; // px
const SNAP_V = 3; // px/s
const SHADES = Array.from({ length: LEVELS }, (_, l) => {
  const g = Math.round((l / (LEVELS - 1)) * 255);
  return `rgb(${g},${g},${g})`;
});

export const usePortraitParticles = (src) => {
  const canvasRef = useRef(null);
  const baseRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const base = baseRef.current;
    const tctx = canvas?.getContext('2d');
    const bctx = base?.getContext('2d');
    if (!canvas || !base || !tctx || !bctx || shouldReduceMotion())
      return undefined;

    let alive = true;
    let img = null;
    let n = 0;
    let ox, oy, x, y, vx, vy, lv, rnd, act, list;
    let cellStart, cellItems;
    let cols = 0;
    let rows = 0;
    let count = 0;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let onScreen = true;
    // Pointer state: mutable, read by the loop, never React state.
    let rect = null;
    let rectDirty = true;
    let pointerOn = false;
    let px = 0; // latest pointer position
    let py = 0;
    let qx = 0; // pointer position at the previous frame (sweep path start)
    let qy = 0;
    let lx = 0; // position at the previous pointer event, for velocity
    let ly = 0;
    let pvx = 0;
    let pvy = 0;
    let pt = 0; // timestamp of the last pointer event
    let cx = 0; // closest point on the sweep path, set by toPath
    let cy = 0;

    // Two layers: the resting portrait is painted once on `base`; only
    // displaced particles are simulated and redrawn each frame on `top`.
    const drawBase = () => {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, cssW, cssH);
      let cur = -1;
      for (let i = 0; i < n; i++) {
        if (lv[i] !== cur) {
          cur = lv[i];
          bctx.fillStyle = SHADES[cur];
        }
        bctx.fillRect(ox[i] - DOT / 2, oy[i] - DOT / 2, DOT, DOT);
      }
    };
    const activate = (i) => {
      act[i] = 1;
      list[count++] = i;
      bctx.clearRect(ox[i] - DOT, oy[i] - DOT, DOT * 2, DOT * 2);
    };
    const deactivate = (k) => {
      const i = list[k];
      act[i] = 0;
      list[k] = list[--count];
      x[i] = ox[i];
      y[i] = oy[i];
      vx[i] = 0;
      vy[i] = 0;
      bctx.fillStyle = SHADES[lv[i]];
      bctx.fillRect(ox[i] - DOT / 2, oy[i] - DOT / 2, DOT, DOT);
    };

    // Squared distance from a point to the pointer's path since the last
    // frame (a segment), leaving the closest point in cx/cy. A fast sweep
    // therefore leaves no gaps between frames.
    const toPath = (ax, ay) => {
      const sx = px - qx;
      const sy = py - qy;
      const l2 = sx * sx + sy * sy;
      let u = l2 > 1e-6 ? ((ax - qx) * sx + (ay - qy) * sy) / l2 : 0;
      u = u < 0 ? 0 : u > 1 ? 1 : u;
      cx = qx + u * sx;
      cy = qy + u * sy;
      const dx = ax - cx;
      const dy = ay - cy;
      return dx * dx + dy * dy;
    };

    const activateNearPath = () => {
      const r2 = RADIUS * RADIUS;
      const c0 = Math.max(0, Math.floor((Math.min(px, qx) - RADIUS) / RADIUS));
      const c1 = Math.min(
        cols - 1,
        Math.floor((Math.max(px, qx) + RADIUS) / RADIUS)
      );
      const r0 = Math.max(0, Math.floor((Math.min(py, qy) - RADIUS) / RADIUS));
      const r1 = Math.min(
        rows - 1,
        Math.floor((Math.max(py, qy) + RADIUS) / RADIUS)
      );
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const cell = r * cols + c;
          for (let k = cellStart[cell]; k < cellStart[cell + 1]; k++) {
            const i = cellItems[k];
            if (!act[i] && toPath(ox[i], oy[i]) < r2) activate(i);
          }
        }
      }
    };

    const step = (now) => {
      raf = 0;
      acc += Math.min(Math.max((now - last) / 1000, 0), MAX_FRAME);
      last = now;

      if (pointerOn && now - pt > STALE_MS) {
        pvx = 0;
        pvy = 0;
      }
      if (pointerOn) activateNearPath();

      const r2 = RADIUS * RADIUS;
      // Without a completed step there is nothing to judge, so stay awake.
      let busy = true;
      // Fixed steps with a bounded remainder: identical motion at any refresh
      // rate. Convergence is judged on the last step of the frame.
      while (acc >= STEP) {
        acc -= STEP;
        busy = pvx !== 0 || pvy !== 0;
        for (let k = count - 1; k >= 0; k--) {
          const i = list[k];
          // Spring toward home runs every step, hover included, so the
          // repulsion can never accumulate without bound.
          let ax = (ox[i] - x[i]) * SPRING - vx[i] * DAMP;
          let ay = (oy[i] - y[i]) * SPRING - vy[i] * DAMP;
          let forced = false;
          if (pointerOn) {
            const d2 = toPath(x[i], y[i]);
            if (d2 < r2) {
              forced = true;
              const d = Math.sqrt(d2);
              const t = 1 - d / RADIUS;
              const f = t * t * (3 - 2 * t); // smoothstep: no hard edge
              let dx = x[i] - cx;
              let dy = y[i] - cy;
              if (d < 0.5) {
                dx = rnd[i];
                dy = 1 - Math.abs(rnd[i]);
              }
              const inv = 1 / (Math.sqrt(dx * dx + dy * dy) || 1);
              dx *= inv;
              dy *= inv;
              const side = rnd[i] < 0 ? -TANGENT : TANGENT;
              ax += f * (PUSH * (dx - dy * side) + SWEEP * pvx);
              ay += f * (PUSH * (dy + dx * side) + SWEEP * pvy);
            }
          }
          vx[i] += ax * STEP;
          vy[i] += ay * STEP;
          const v2 = vx[i] * vx[i] + vy[i] * vy[i];
          if (v2 > MAX_V * MAX_V) {
            const s = MAX_V / Math.sqrt(v2);
            vx[i] *= s;
            vy[i] *= s;
          }
          x[i] += vx[i] * STEP;
          y[i] += vy[i] * STEP;

          const ex = ox[i] - x[i];
          const ey = oy[i] - y[i];
          const settled =
            ex * ex + ey * ey < SNAP_D * SNAP_D &&
            vx[i] * vx[i] + vy[i] * vy[i] < SNAP_V * SNAP_V;
          if (settled && !forced) deactivate(k);
          // A particle held at equilibrium by a still cursor is not busy.
          else if (!settled && (!forced || vx[i] * vx[i] + vy[i] * vy[i] > 1))
            busy = true;
        }
      }

      qx = px;
      qy = py;

      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, cssW, cssH);
      let cur = -1;
      for (let k = 0; k < count; k++) {
        const i = list[k];
        if (lv[i] !== cur) {
          cur = lv[i];
          tctx.fillStyle = SHADES[cur];
        }
        tctx.fillRect(x[i] - DOT / 2, y[i] - DOT / 2, DOT, DOT);
      }

      // Continue directly: wake() would re-prime the clock and add a step.
      if (count && busy && onScreen && !document.hidden)
        raf = requestAnimationFrame(step);
    };

    function wake() {
      if (raf || !onScreen || document.hidden || !n) return;
      // Prime one step so the first frame after idle already moves particles.
      acc = STEP;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    const build = () => {
      if (!img) return;
      rect = canvas.getBoundingClientRect();
      rectDirty = false;
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      if (!cssW || !cssH || !rect.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = base.width = Math.round(cssW * dpr);
      canvas.height = base.height = Math.round(cssH * dpr);

      // Mirror object-contain object-bottom so the layout matches the <img>.
      const s = Math.min(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      const off = document.createElement('canvas');
      off.width = Math.ceil(cssW);
      off.height = Math.ceil(cssH);
      const octx = off.getContext('2d', { willReadFrequently: true });
      octx.drawImage(img, (cssW - w) / 2, cssH - h, w, h);
      let data;
      try {
        data = octx.getImageData(0, 0, off.width, off.height).data;
      } catch {
        return; // tainted or unreadable: leave the <img> fallback visible
      }

      const gap = Math.max(
        3,
        Math.ceil(Math.sqrt((off.width * off.height) / MAX_PARTICLES))
      );
      const cap = Math.ceil(off.width / gap) * Math.ceil(off.height / gap);
      const buckets = Array.from({ length: LEVELS }, () => []);
      for (let gy = gap / 2; gy < off.height; gy += gap) {
        for (let gx = gap / 2; gx < off.width; gx += gap) {
          const p = (Math.floor(gy) * off.width + Math.floor(gx)) * 4;
          if (data[p + 3] < 64) continue;
          const g = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
          buckets[Math.round((g / 255) * (LEVELS - 1))].push(gx, gy);
        }
      }

      ox = new Float32Array(cap);
      oy = new Float32Array(cap);
      lv = new Uint8Array(cap);
      n = 0;
      // Grouped by level so drawBase() changes fillStyle at most LEVELS times.
      buckets.forEach((b, level) => {
        for (let j = 0; j < b.length; j += 2) {
          ox[n] = b[j];
          oy[n] = b[j + 1];
          lv[n++] = level;
        }
      });
      x = ox.slice();
      y = oy.slice();
      vx = new Float32Array(cap);
      vy = new Float32Array(cap);
      rnd = Float32Array.from({ length: cap }, () => Math.random() * 2 - 1);
      act = new Uint8Array(cap);
      list = new Int32Array(cap);
      count = 0;

      // Uniform grid (CSR) so activation scans only cells near the cursor path
      // instead of every particle.
      cols = Math.ceil(cssW / RADIUS);
      rows = Math.ceil(cssH / RADIUS);
      cellStart = new Int32Array(cols * rows + 1);
      const cellOf = (i) =>
        Math.min(rows - 1, Math.floor(oy[i] / RADIUS)) * cols +
        Math.min(cols - 1, Math.floor(ox[i] / RADIUS));
      for (let i = 0; i < n; i++) cellStart[cellOf(i) + 1]++;
      for (let c = 0; c < cols * rows; c++) cellStart[c + 1] += cellStart[c];
      const fill = cellStart.slice(0, -1);
      cellItems = new Int32Array(n);
      for (let i = 0; i < n; i++) cellItems[fill[cellOf(i)]++] = i;

      tctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBase();
      setReady(true);
    };

    const onMove = (e) => {
      if (!n) return;
      if (rectDirty || !rect) {
        rect = canvas.getBoundingClientRect();
        rectDirty = false;
      }
      px = ((e.clientX - rect.left) / rect.width) * cssW;
      py = ((e.clientY - rect.top) / rect.height) * cssH;
      const t = e.timeStamp;
      if (!pointerOn) {
        qx = lx = px;
        qy = ly = py;
        pvx = 0;
        pvy = 0;
      } else if (t > pt) {
        // Light smoothing and a cap: one jumpy event cannot launch particles.
        const dt = (t - pt) / 1000;
        pvx += ((px - lx) / dt - pvx) * 0.5;
        pvy += ((py - ly) / dt - pvy) * 0.5;
        const sp = Math.hypot(pvx, pvy);
        if (sp > MAX_POINTER_V) {
          pvx *= MAX_POINTER_V / sp;
          pvy *= MAX_POINTER_V / sp;
        }
      }
      lx = px;
      ly = py;
      pt = t;
      pointerOn = true;
      wake();
    };
    const onEnter = (e) => {
      rectDirty = true;
      onMove(e);
    };
    const reset = () => {
      pointerOn = false;
      pvx = 0;
      pvy = 0;
      wake();
    };
    const onUp = (e) => {
      if (e.pointerType !== 'mouse') reset();
    };
    const onVisibility = () => {
      if (document.hidden) reset();
      else wake();
    };
    const markRect = () => {
      rectDirty = true;
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
    });
    const ro = new ResizeObserver(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      build();
    });

    const image = new Image();
    image.onload = () => {
      if (!alive) return;
      img = image;
      ro.observe(canvas);
    };
    image.src = src;

    io.observe(canvas);
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onEnter);
    canvas.addEventListener('pointerleave', reset);
    canvas.addEventListener('pointercancel', reset);
    canvas.addEventListener('pointerup', onUp);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', markRect, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onEnter);
      canvas.removeEventListener('pointerleave', reset);
      canvas.removeEventListener('pointercancel', reset);
      canvas.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', markRect);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [src]);

  return { canvasRef, baseRef, ready };
};

export default usePortraitParticles;
