import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, createAnimatable, createScope, utils } from 'animejs';
import { shouldReduceMotion } from '@/animations';
import {
  byteDizzy,
  byteHop,
  byteLand,
  byteRelease,
  byteSettle,
  byteSit,
  byteSpin,
  byteStand,
  byteStretch,
  byteWiggle,
} from '@/animations/presets/byte';
import { easterEggs, speech, SECTION_IDS } from '../data/speech';
import {
  anchorsForSection,
  clampToViewport,
  petSize,
  travelDuration,
} from '../utils/safeArea';

const MOBILE_QUERY = '(max-width: 767px)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// Distance bands, in px, from the cursor to the pet's centre.
const LOOK_RADIUS = 200; // eyes begin tracking
const EXCITED_RADIUS = 110; // mood flips to curious

const IDLE_SLEEP_MS = 19000; // inside the 15-25s band the brief set
const GESTURE_MIN_MS = 4000;
const GESTURE_MAX_MS = 9000;
const WANDER_MIN_MS = 4000;
const WANDER_MAX_MS = 8000;
const SECTION_COOLDOWN_MS = 25000;
const BUBBLE_MS = 1900;

// Easter eggs stay out of the first minute of a visit, and no two land within
// three minutes of each other. Rarity is what makes them read as a find.
const EGG_GRACE_MS = 60000;
const EGG_COOLDOWN_MS = 180000;

// Release velocity is clamped hard. Past this, a flick reads as chaotic rather
// than playful, and the boundary bounces start to look like a bug.
const MAX_VELOCITY = { x: 30, y: 26 };
const FRICTION = 0.92;
const BOUNCE_DAMPING = 0.42;
const REST_SPEED = 0.4;

const randomBetween = (min, max) => min + Math.random() * (max - min);

const pickLine = (pool, previous) => {
  if (!pool || pool.length === 0) return null;
  const options = pool.filter((line) => line !== previous);
  const source = options.length > 0 ? options : pool;
  return source[Math.floor(Math.random() * source.length)];
};

// The awake gesture pool. Names map to the animation chosen in `playGesture`;
// keeping them as strings lets the pool be shuffled and filtered cheaply.
const GESTURES = [
  'blink',
  'earTwitch',
  'tailWag',
  'wave',
  'hop',
  'wiggle',
  'stretch',
  'lookLeft',
  'lookRight',
  'sit',
];

/**
 * BYTE's whole behaviour system.
 *
 * Position is written through createAnimatable rather than React state: the pet
 * moves on nearly every frame while travelling or being thrown, and routing
 * that through a setState would re-render the tree at 60fps for a decorative
 * overlay. Mood, speech and section are the only things React needs to know,
 * because they are the only things that change what is rendered.
 *
 * Everything with a lifetime - timers, listeners, observers, frames, the Anime
 * scope - is registered in one place and torn down in the single cleanup at the
 * bottom of the main effect.
 */
export const useBytePet = () => {
  const shellRef = useRef(null); // positioned wrapper, owns x/y
  const bodyRef = useRef(null); // inner body, owns gesture transforms

  const [mood, setMood] = useState('idle');
  const [section, setSection] = useState('home');
  const [bubble, setBubble] = useState(null);
  const [ready, setReady] = useState(false);
  // True while BYTE's body overlaps a control on the page beneath it. The
  // component drops pointer-events in that case, so the control keeps working
  // even in the moments BYTE is passing over it - the safe-area system keeps
  // it from *settling* on one, and this covers the transit.
  const [blocking, setBlocking] = useState(false);
  // Eye/ear direction, -1..1 on each axis. State rather than a ref because the
  // pupils are rendered by React, but it is written at most a few times a
  // second: the pointer handler quantises before it commits (see below).
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // --- refs for animation-rate state -------------------------------------
  const animatableRef = useRef(null);
  const scopeRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: -9999, y: -9999 });
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const lastPointerTimeRef = useRef(0);
  const frameRef = useRef(0);
  const timersRef = useRef(new Set());
  const anchorRef = useRef('bottom-right');
  const sectionRef = useRef('home');
  const sectionSeenRef = useRef(new Map());
  const welcomedRef = useRef(false);
  const footerStageRef = useRef(0);
  const lastInteractionRef = useRef(Date.now());
  const sleepingRef = useRef(false);
  const moodRef = useRef('idle');
  const lastGestureRef = useRef(null);
  const lastLineRef = useRef(null);
  const bubbleTimerRef = useRef(0);
  const walkLoopRef = useRef(null);
  const reducedRef = useRef(false);
  const mobileRef = useRef(false);
  const finePointerRef = useRef(true);
  const sizeRef = useRef(104);
  const petTrackRef = useRef({ distance: 0, reversals: 0, lastDx: 0, at: 0 });
  const nearSinceRef = useRef(0);
  const mountedAtRef = useRef(0);
  const lastEggRef = useRef(0);

  // A timer helper that registers every handle, so none can outlive the hook.
  const later = useCallback((fn, delay) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, delay);
    timersRef.current.add(id);
    return id;
  }, []);

  const setMoodSafe = useCallback((next) => {
    if (moodRef.current === next) return;
    moodRef.current = next;
    setMood(next);
  }, []);

  // --- speech -------------------------------------------------------------
  const say = useCallback(
    (line, { then } = {}) => {
      if (!line) return;
      window.clearTimeout(bubbleTimerRef.current);
      lastLineRef.current = line;
      setBubble(line);
      bubbleTimerRef.current = window.setTimeout(() => {
        setBubble(null);
        // A follow-up line waits for the first bubble to clear, so the two read
        // as a correction rather than one run-on sentence.
        if (then) later(() => say(then), 320);
      }, BUBBLE_MS);
    },
    [later]
  );

  const sayFrom = useCallback(
    (pool, options) => say(pickLine(pool, lastLineRef.current), options),
    [say]
  );

  // --- position writing ---------------------------------------------------
  const writePosition = useCallback((x, y, duration = 0) => {
    const clamped = clampToViewport(x, y, sizeRef.current);
    positionRef.current = clamped;
    const animatable = animatableRef.current;
    if (animatable) {
      animatable.x(clamped.x, duration);
      animatable.y(clamped.y, duration);
    } else if (shellRef.current) {
      // Before the animatable exists, and under reduced motion where none is
      // created, write the transform directly.
      shellRef.current.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`;
    }
    return clamped;
  }, []);

  // --- gestures -----------------------------------------------------------
  const playBody = useCallback((config) => {
    const body = bodyRef.current;
    if (!body || reducedRef.current) return null;
    return animate(body, config);
  }, []);

  const playGesture = useCallback(
    (name) => {
      if (reducedRef.current) return;
      lastGestureRef.current = name;

      switch (name) {
        case 'hop':
          playBody(byteHop());
          break;
        case 'wiggle':
        case 'wave':
          playBody(byteWiggle());
          break;
        case 'stretch':
          playBody(byteStretch());
          break;
        case 'spin':
          playBody(byteSpin());
          break;
        case 'dizzy':
          playBody(byteDizzy());
          break;
        case 'sit':
          playBody(byteSit());
          later(() => playBody(byteStand()), 1400);
          break;
        case 'lookLeft':
          setGaze({ x: -1, y: 0 });
          later(() => setGaze({ x: 0, y: 0 }), 900);
          break;
        case 'lookRight':
          setGaze({ x: 1, y: 0 });
          later(() => setGaze({ x: 0, y: 0 }), 900);
          break;
        // blink, earTwitch and tailWag are CSS-driven on the character, so the
        // gesture only has to flag itself on the element for one beat.
        case 'blink':
        case 'earTwitch':
        case 'tailWag':
        default: {
          const body = bodyRef.current;
          if (!body) break;
          body.dataset.gesture = name;
          later(() => {
            if (bodyRef.current) delete bodyRef.current.dataset.gesture;
          }, 700);
          break;
        }
      }
    },
    [later, playBody]
  );

  // --- travel -------------------------------------------------------------
  const travelTo = useCallback(
    (target, anchorId) => {
      if (draggingRef.current || reducedRef.current) return;

      const { x, y } = positionRef.current;
      const dx = target.x - x;
      const dy = target.y - y;
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;

      const duration = travelDuration(dx, dy);
      if (anchorId) anchorRef.current = anchorId;

      setMoodSafe('walking');
      // Lean into the direction of travel and face it. The character reads
      // `data-facing` for the horizontal flip.
      const body = bodyRef.current;
      if (body) {
        body.dataset.facing = dx < 0 ? 'left' : 'right';
        body.dataset.lean = dx < 0 ? 'left' : 'right';
      }

      // The walk bounce runs on a nested element so it composes with, rather
      // than fights, any gesture transform on the body itself.
      const gait = body?.querySelector('[data-byte-gait]');
      if (gait) {
        walkLoopRef.current?.pause();
        walkLoopRef.current = animate(gait, {
          translateY: [0, -3, 0],
          duration: 340,
          loop: true,
          ease: 'inOutSine',
        });
      }

      writePosition(target.x, target.y, duration);

      later(() => {
        walkLoopRef.current?.pause();
        walkLoopRef.current = null;
        if (gait) utils.set(gait, { translateY: 0 });
        if (bodyRef.current) delete bodyRef.current.dataset.lean;
        playBody(byteLand());
        if (!sleepingRef.current) setMoodSafe('idle');
      }, duration);
    },
    [later, playBody, setMoodSafe, writePosition]
  );

  const wander = useCallback(() => {
    if (draggingRef.current || sleepingRef.current || reducedRef.current)
      return;
    const anchors = anchorsForSection(
      sectionRef.current,
      sizeRef.current,
      mobileRef.current
    );
    // Every anchor is currently covered by a control: hold position rather
    // than move onto one.
    if (anchors.length === 0) return;
    const next = anchors.filter((a) => a.id !== anchorRef.current);
    const pool = next.length > 0 ? next : anchors;
    const anchor = pool[Math.floor(Math.random() * pool.length)];
    travelTo(anchor, anchor.id);
  }, [travelTo]);

  // --- sleep / wake -------------------------------------------------------
  const fallAsleep = useCallback(() => {
    if (sleepingRef.current || draggingRef.current) return;
    sleepingRef.current = true;
    setMoodSafe('sleepy');
    playBody(byteStretch());
    later(() => {
      if (!sleepingRef.current) return;
      playBody(byteSit());
      setMoodSafe('sleeping');
      sayFrom(speech.sleep);
    }, 700);
  }, [later, playBody, sayFrom, setMoodSafe]);

  const registerInteraction = useCallback(
    ({ wakeSpeech = true } = {}) => {
      lastInteractionRef.current = Date.now();
      if (!sleepingRef.current) return;
      sleepingRef.current = false;
      playBody(byteStand());
      later(() => playBody(byteHop()), 120);
      setMoodSafe('idle');
      if (wakeSpeech) sayFrom(speech.wake);
    },
    [later, playBody, sayFrom, setMoodSafe]
  );

  // --- interactions -------------------------------------------------------
  const handleClick = useCallback(() => {
    registerInteraction({ wakeSpeech: false });
    setMoodSafe('happy');
    playGesture('hop');
    sayFrom(speech.happy);
    later(() => {
      if (!sleepingRef.current) setMoodSafe('idle');
    }, 900);
  }, [later, playGesture, registerInteraction, sayFrom, setMoodSafe]);

  const handleDoubleClick = useCallback(() => {
    registerInteraction({ wakeSpeech: false });
    setMoodSafe('excited');
    playGesture('spin');
    sayFrom(speech.celebrate);
    later(() => {
      if (!sleepingRef.current) setMoodSafe('idle');
    }, 1200);
  }, [later, playGesture, registerInteraction, sayFrom, setMoodSafe]);

  // --- drag ---------------------------------------------------------------
  const handlePointerDown = useCallback(
    (event) => {
      if (reducedRef.current) return;
      // Only a primary press starts a drag; a right-click should open the
      // context menu like anywhere else on the page.
      if (event.button !== undefined && event.button !== 0) return;

      registerInteraction({ wakeSpeech: false });
      draggingRef.current = true;
      velocityRef.current = { x: 0, y: 0 };
      cancelAnimationFrame(frameRef.current);

      const { x, y } = positionRef.current;
      dragOffsetRef.current = {
        x: event.clientX - x,
        y: event.clientY - y,
      };
      lastPointerTimeRef.current = performance.now();
      setMoodSafe('dragged');
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    [registerInteraction, setMoodSafe]
  );

  const settleAfterThrow = useCallback(() => {
    const step = () => {
      const velocity = velocityRef.current;
      let { x, y } = positionRef.current;

      x += velocity.x;
      y += velocity.y;

      const size = sizeRef.current;
      const clamped = clampToViewport(x, y, size);

      // A boundary hit reverses and heavily damps that axis, so BYTE taps the
      // edge and loses most of its energy rather than rattling along it.
      if (clamped.x !== x) velocity.x = -velocity.x * BOUNCE_DAMPING;
      if (clamped.y !== y) velocity.y = -velocity.y * BOUNCE_DAMPING;

      velocity.x *= FRICTION;
      velocity.y *= FRICTION;

      writePosition(clamped.x, clamped.y, 0);

      if (Math.hypot(velocity.x, velocity.y) > REST_SPEED) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      // Out of energy: hand the last few pixels to a spring so the stop has
      // some give, then resume normal behaviour.
      velocityRef.current = { x: 0, y: 0 };
      const shell = shellRef.current;
      if (shell && !reducedRef.current) {
        const rest = positionRef.current;
        animate(shell, {
          x: rest.x,
          y: rest.y,
          ease: byteRelease(),
          duration: 420,
        });
      }
      playBody(byteLand());
      if (!sleepingRef.current) setMoodSafe('idle');
    };

    frameRef.current = requestAnimationFrame(step);
  }, [playBody, setMoodSafe, writePosition]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const elapsed = Math.max(1, now - lastPointerTimeRef.current);

      const nextX = event.clientX - dragOffsetRef.current.x;
      const nextY = event.clientY - dragOffsetRef.current.y;
      const previous = positionRef.current;

      // Velocity in px per ~16ms frame, which is the unit the settle loop
      // integrates in, clamped so a fast flick cannot launch BYTE off screen.
      velocityRef.current = {
        x: utils.clamp(
          ((nextX - previous.x) / elapsed) * 16,
          -MAX_VELOCITY.x,
          MAX_VELOCITY.x
        ),
        y: utils.clamp(
          ((nextY - previous.y) / elapsed) * 16,
          -MAX_VELOCITY.y,
          MAX_VELOCITY.y
        ),
      };

      lastPointerTimeRef.current = now;
      writePosition(nextX, nextY, 0);
    },
    [writePosition]
  );

  const handlePointerUp = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      event.currentTarget?.releasePointerCapture?.(event.pointerId);
      lastInteractionRef.current = Date.now();

      if (Math.hypot(velocityRef.current.x, velocityRef.current.y) > 1) {
        sayFrom(speech.dragged);
        settleAfterThrow();
        return;
      }

      // Barely moved: skip the physics and let the spring do the wobble.
      const shell = shellRef.current;
      const rest = positionRef.current;
      if (shell && !reducedRef.current) {
        animate(shell, {
          x: rest.x,
          y: rest.y,
          ease: byteSettle(),
          duration: 520,
        });
      }
      playBody(byteLand());
      setMoodSafe('idle');
    },
    [playBody, sayFrom, setMoodSafe, settleAfterThrow]
  );

  // --- main effect: listeners, observers, timers ---------------------------
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    reducedRef.current = shouldReduceMotion();
    mobileRef.current = window.matchMedia(MOBILE_QUERY).matches;
    finePointerRef.current = window.matchMedia(FINE_POINTER).matches;
    sizeRef.current = petSize(mobileRef.current);

    // The idle clock starts when BYTE mounts, not when the ref was first
    // created. Under StrictMode's double-invoke, and on a slow first paint,
    // the ref's initial timestamp can already be seconds stale by the time
    // the effect runs - which was enough to put BYTE to sleep almost
    // immediately on a page nobody had touched yet.
    lastInteractionRef.current = Date.now();
    mountedAtRef.current = Date.now();

    // Opening position: the bottom-right corner, clamped like everything else.
    //
    // Under reduced motion BYTE never moves again, so it is parked a little
    // higher up the right edge instead. The very bottom corner is where the
    // footer's link row and the carousel's controls sit, and a pet that
    // cannot wander off them would have to yield pointer events forever -
    // which in testing left it permanently unclickable.
    const restOffset = reducedRef.current ? 140 : 20;
    const start = clampToViewport(
      window.innerWidth - sizeRef.current - 20,
      window.innerHeight - sizeRef.current - restOffset,
      sizeRef.current
    );
    positionRef.current = start;
    shell.style.transform = `translate3d(${start.x}px, ${start.y}px, 0)`;
    anchorRef.current = 'bottom-right';
    setReady(true);

    // Under reduced motion BYTE parks in one corner and never travels, so no
    // animatable, no scope, and no wander or gesture timers are created at all.
    if (!reducedRef.current) {
      scopeRef.current = createScope({ root: shell }).add(() => {
        animatableRef.current = createAnimatable(shell, {
          x: { duration: 900, ease: 'outQuad' },
          y: { duration: 900, ease: 'outQuad' },
        });
        // createAnimatable starts from the element's current transform, but
        // state it explicitly so the first travel interpolates from the corner
        // rather than from the origin.
        animatableRef.current.x(start.x, 0);
        animatableRef.current.y(start.y, 0);
      });
    }

    // --- cursor tracking, throttled to animation frames ---
    let pointerFrame = 0;
    const applyPointer = () => {
      pointerFrame = 0;
      if (draggingRef.current || sleepingRef.current) return;

      const size = sizeRef.current;
      const { x, y } = positionRef.current;
      const centreX = x + size / 2;
      const centreY = y + size / 2;
      const dx = pointerRef.current.x - centreX;
      const dy = pointerRef.current.y - centreY;
      const distance = Math.hypot(dx, dy);

      if (distance > LOOK_RADIUS) {
        nearSinceRef.current = 0;
        setGaze((current) =>
          current.x === 0 && current.y === 0 ? current : { x: 0, y: 0 }
        );
        if (moodRef.current === 'curious') setMoodSafe('idle');
        return;
      }

      // Quantised to one decimal. The pupils move in whole sub-pixels anyway,
      // so committing every micro-change would re-render for nothing.
      const next = {
        x: Math.round(utils.clamp(dx / LOOK_RADIUS, -1, 1) * 10) / 10,
        y: Math.round(utils.clamp(dy / LOOK_RADIUS, -1, 1) * 10) / 10,
      };
      setGaze((current) =>
        current.x === next.x && current.y === next.y ? current : next
      );

      if (distance < EXCITED_RADIUS) {
        if (moodRef.current !== 'curious' && moodRef.current !== 'happy') {
          setMoodSafe('curious');
          if (Math.random() < 0.25) sayFrom(speech.curious);
        }
        // The occasional playful approach. Gated on the cursor lingering, on a
        // low roll, and on not already walking, so it stays a surprise.
        const now = performance.now();
        if (nearSinceRef.current === 0) nearSinceRef.current = now;
        if (
          now - nearSinceRef.current > 1400 &&
          moodRef.current !== 'walking' &&
          Math.random() < 0.08
        ) {
          nearSinceRef.current = now;
          const hop = 40 + Math.random() * 40;
          const scale = hop / (distance || 1);
          travelTo({ x: x + dx * scale, y: y + dy * scale });
        }
      }
    };

    const onPointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      lastInteractionRef.current = Date.now();
      if (sleepingRef.current) registerInteraction();
      if (!finePointerRef.current) return;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(applyPointer);
    };

    const onScroll = () => {
      lastInteractionRef.current = Date.now();
      if (sleepingRef.current) registerInteraction();
    };

    const onKeyDown = () => {
      lastInteractionRef.current = Date.now();
    };

    const onResize = () => {
      mobileRef.current = window.matchMedia(MOBILE_QUERY).matches;
      sizeRef.current = petSize(mobileRef.current);
      // Re-clamp in place so a shrink never strands BYTE outside the viewport.
      const { x, y } = positionRef.current;
      writePosition(x, y, 0);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('resize', onResize);

    // --- section awareness ---
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (id === sectionRef.current) continue;
          sectionRef.current = id;
          setSection(id);

          const now = Date.now();
          const lastSeen = sectionSeenRef.current.get(id) ?? 0;
          if (now - lastSeen < SECTION_COOLDOWN_MS) continue;
          sectionSeenRef.current.set(id, now);

          if (id === 'home') {
            // The welcome is handled at mount, not here: the hero is already
            // intersecting on load, so this branch only ever runs when a
            // visitor scrolls *back* to the top - at which point the greeting
            // has been said and the ordinary hero line is what belongs.
            sayFrom(speech.section.home);
            continue;
          }

          sayFrom(speech.section[id]);

          // Section-specific gestures. Each is a single short beat.
          if (id === 'work') {
            setMoodSafe('excited');
            playGesture('hop');
            later(() => {
              if (!sleepingRef.current) setMoodSafe('idle');
            }, 1000);
          } else if (id === 'experience') {
            // The salute: a brief, restrained ear-raise rather than a flourish.
            const body = bodyRef.current;
            if (body) {
              body.dataset.gesture = 'salute';
              later(() => {
                if (bodyRef.current) delete bodyRef.current.dataset.gesture;
              }, 1200);
            }
          } else if (id === 'service') {
            playGesture('wave');
          } else if (id === 'about') {
            playGesture('lookLeft');
          } else if (id === 'contact') {
            playGesture('sit');
          }

          // Move into a corner that suits the new section on the next beat.
          later(() => wander(), 600);
        }
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // The greeting, once per page load. It is scheduled here rather than from
    // the observer because the hero is already on screen when BYTE mounts, so
    // no *change* of section is ever reported for it. The delay lets the page
    // settle first - a bubble competing with the hero's own entrance reads as
    // clutter. `home` is recorded as seen so the section cooldown treats the
    // greeting as that section's reaction.
    // The flag is set when the line is actually *said*, not when it is
    // scheduled. Setting it at schedule time meant StrictMode's double-invoke
    // in development swallowed the greeting entirely: the first pass armed the
    // timer and set the flag, its cleanup cleared the timer, and the second
    // pass then saw the flag and never rearmed it.
    if (!welcomedRef.current) {
      sectionSeenRef.current.set('home', Date.now());
      later(() => {
        welcomedRef.current = true;
        sayFrom(speech.welcome);
      }, 1600);
    }

    // The footer gets its own observer: it is not a `section[id]`, and its
    // two lines are staged rather than random.
    const footer = document.querySelector('footer');
    let footerObserver = null;
    if (footer) {
      // The footer lines wait until the visitor has actually come to rest
      // there. A bare intersection fired while merely scrolling *past* the
      // end of the page, and "that's all." would land on top of whichever
      // section's reaction was already on screen. The delay is cancelled the
      // moment the footer leaves view again, so only a real stop speaks.
      let footerDwell = 0;
      footerObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              window.clearTimeout(footerDwell);
              footerDwell = 0;
              continue;
            }
            if (footerStageRef.current > 1 || footerDwell) continue;
            footerDwell = window.setTimeout(() => {
              footerDwell = 0;
              if (footerStageRef.current > 1) return;
              const line = speech.footer[footerStageRef.current];
              footerStageRef.current += 1;
              playGesture('sit');
              say(line);
            }, 1200);
            timersRef.current.add(footerDwell);
          }
        },
        { threshold: 0.6 }
      );
      footerObserver.observe(footer);
    }

    // --- idle, gesture and wander ticks ---
    // Each reschedules itself with a fresh random delay rather than running on
    // a fixed interval, which is what keeps the rhythm from reading mechanical.
    let idleTimer = 0;
    let gestureTimer = 0;
    let wanderTimer = 0;

    // Is a real control sitting under BYTE right now?
    //
    // The whole footprint is sampled - the centre plus four inset corners -
    // because a button BYTE only half covers is still a button the visitor
    // cannot press. When any sample finds one, BYTE yields pointer events
    // entirely and the control underneath becomes reachable through it.
    //
    // Only genuine controls count. An earlier version also matched
    // `[tabindex]`, which caught the page's own scroll containers and latched
    // this on permanently, leaving BYTE unclickable rather than merely polite.
    //
    // `elementsFromPoint` returns the whole stack at a point, so BYTE's own
    // subtree is filtered out and what remains is what is genuinely beneath.
    const CONTROL_SELECTOR =
      'a[href], button:not(:disabled), input, textarea, select';

    const detectBlocking = () => {
      if (draggingRef.current) {
        setBlocking(false);
        return;
      }
      const size = sizeRef.current;
      const { x, y } = positionRef.current;
      const inset = size * 0.3;
      const covered = [
        [x + size / 2, y + size / 2],
        [x + inset, y + inset],
        [x + size - inset, y + inset],
        [x + inset, y + size - inset],
        [x + size - inset, y + size - inset],
      ].some(([px, py]) =>
        document
          .elementsFromPoint(px, py)
          .some(
            (node) =>
              !node.closest?.('[data-byte-shell]') &&
              node.closest?.(CONTROL_SELECTOR)
          )
      );
      setBlocking((current) => (current === covered ? current : covered));
    };

    const idleTick = () => {
      if (
        !draggingRef.current &&
        !sleepingRef.current &&
        Date.now() - lastInteractionRef.current > IDLE_SLEEP_MS
      ) {
        fallAsleep();
      }
      detectBlocking();
      idleTimer = window.setTimeout(idleTick, 1200);
    };

    const gestureTick = () => {
      if (!draggingRef.current && !sleepingRef.current && !reducedRef.current) {
        // Easter eggs roll first, and each carries its own independent chance,
        // so adding one never makes the others more likely.
        //
        // They are held back for the first stretch of a visit and then rate
        // limited. Without the grace period a 2% roll every few seconds lands
        // one within the first few ticks surprisingly often - "production is
        // down." as a greeting is a worse joke than as a surprise twenty
        // minutes in, and it stepped on the actual greeting.
        const sinceMount = Date.now() - mountedAtRef.current;
        const eggsAllowed =
          sinceMount > EGG_GRACE_MS &&
          Date.now() - lastEggRef.current > EGG_COOLDOWN_MS;

        let handled = false;
        if (eggsAllowed) {
          for (const candidate of easterEggs) {
            if (Math.random() < candidate.chance) {
              handled = true;
              lastEggRef.current = Date.now();
              if (candidate.gesture) playGesture(candidate.gesture);
              if (candidate.line)
                say(candidate.line, { then: candidate.follow });
              break;
            }
          }
        }

        if (!handled) {
          const pool = GESTURES.filter(
            (name) => name !== lastGestureRef.current
          );
          playGesture(pool[Math.floor(Math.random() * pool.length)]);
          // Speech is rarer than gesture, so BYTE is not constantly talking.
          if (Math.random() < 0.18) sayFrom(speech.idle);
        }
      }
      gestureTimer = window.setTimeout(
        gestureTick,
        randomBetween(GESTURE_MIN_MS, GESTURE_MAX_MS)
      );
    };

    const wanderTick = () => {
      wander();
      wanderTimer = window.setTimeout(
        wanderTick,
        // Mobile wanders about half as often: less movement over a narrow
        // column, and fewer transform-driven repaints on weaker hardware.
        randomBetween(
          mobileRef.current ? WANDER_MIN_MS * 2 : WANDER_MIN_MS,
          mobileRef.current ? WANDER_MAX_MS * 2 : WANDER_MAX_MS
        )
      );
    };

    idleTimer = window.setTimeout(idleTick, 3000);
    if (!reducedRef.current) {
      gestureTimer = window.setTimeout(
        gestureTick,
        randomBetween(GESTURE_MIN_MS, GESTURE_MAX_MS)
      );
      wanderTimer = window.setTimeout(
        wanderTick,
        randomBetween(WANDER_MIN_MS, WANDER_MAX_MS)
      );
    }

    const timers = timersRef.current;
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      footerObserver?.disconnect();
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(idleTimer);
      window.clearTimeout(gestureTimer);
      window.clearTimeout(wanderTimer);
      window.clearTimeout(bubbleTimerRef.current);
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      walkLoopRef.current?.pause();
      walkLoopRef.current = null;
      scopeRef.current?.revert();
      scopeRef.current = null;
      animatableRef.current = null;
    };
  }, [
    fallAsleep,
    later,
    playGesture,
    registerInteraction,
    say,
    sayFrom,
    setMoodSafe,
    travelTo,
    wander,
    writePosition,
  ]);

  // --- petting ------------------------------------------------------------
  // A deliberate back-and-forth over the body, not a hover. Direction reversals
  // are counted because a straight pass across BYTE on the way to something
  // else should not read as affection.
  const handleBodyPointerMove = useCallback(
    (event) => {
      if (draggingRef.current || reducedRef.current) return;
      const track = petTrackRef.current;
      const now = performance.now();
      if (now - track.at > 700) {
        track.distance = 0;
        track.reversals = 0;
      }
      track.at = now;

      const dx = event.movementX ?? 0;
      if (
        dx !== 0 &&
        Math.sign(dx) !== Math.sign(track.lastDx) &&
        track.lastDx !== 0
      ) {
        track.reversals += 1;
      }
      if (dx !== 0) track.lastDx = dx;
      track.distance += Math.abs(dx);

      if (track.reversals >= 3 && track.distance > 90) {
        track.distance = 0;
        track.reversals = 0;
        registerInteraction({ wakeSpeech: false });
        setMoodSafe('petted');
        playBody(byteSit());
        later(() => playBody(byteStand()), 900);
        sayFrom(speech.petted);
        later(() => {
          if (!sleepingRef.current) setMoodSafe('idle');
        }, 1600);
      }
    },
    [later, playBody, registerInteraction, sayFrom, setMoodSafe]
  );

  // Touch equivalent: a press held in place, since a phone has no hover pass.
  const holdTimerRef = useRef(0);
  const handleHoldStart = useCallback(() => {
    window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (draggingRef.current) return;
      setMoodSafe('petted');
      playBody(byteSit());
      later(() => playBody(byteStand()), 900);
      sayFrom(speech.petted);
      later(() => {
        if (!sleepingRef.current) setMoodSafe('idle');
      }, 1600);
    }, 600);
  }, [later, playBody, sayFrom, setMoodSafe]);

  const handleHoldEnd = useCallback(() => {
    window.clearTimeout(holdTimerRef.current);
  }, []);

  useEffect(() => () => window.clearTimeout(holdTimerRef.current), []);

  return {
    shellRef,
    bodyRef,
    mood,
    section,
    bubble,
    gaze,
    ready,
    blocking,
    size: sizeRef.current,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
    },
    bodyHandlers: {
      onPointerMove: handleBodyPointerMove,
      onPointerDown: handleHoldStart,
      onPointerUp: handleHoldEnd,
      onPointerLeave: handleHoldEnd,
    },
  };
};

export default useBytePet;
