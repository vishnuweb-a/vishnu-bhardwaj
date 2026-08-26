import { useRef, useEffect } from 'react';
import { animate, createAnimatable, createScope } from 'animejs';
import { shouldReduceMotion } from '@/animations/utils/animationUtils';
import { pointerWipe, wipeIn, wipeOut } from '@/animations/presets/pointerWipe';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// Which edge of the box the pointer crossed on its way in. Whichever of the
// four is nearest at pointerenter is the one it came through: the event fires
// on the boundary itself, so the crossed edge is at distance ~0 and every other
// edge is at least the box's shorter side away.
const entrySide = (event, bounds) => {
  const distances = [
    ['left', event.clientX - bounds.left],
    ['right', bounds.right - event.clientX],
    ['top', event.clientY - bounds.top],
    ['bottom', bounds.bottom - event.clientY],
  ];

  return distances.reduce((nearest, side) =>
    side[1] < nearest[1] ? side : nearest
  )[0];
};

// Drives the hero portrait's colour reveal (design.md section 9): a full-colour
// copy of the cutout uncovered by an edge that trails the cursor.
//
// The rule is "colour fills the span between the edge the pointer came in
// through and the pointer itself". The recording only ever demonstrates this
// from the right - a vertical boundary sweeping left ahead of the cursor - but
// the same rule reads correctly from all four sides, so entry side is measured
// rather than assumed. Coming in from the left or right gives a vertical edge
// travelling on x; from the top or bottom, a horizontal one on y.
//
// The reveal is built from two counter-translations rather than a clip-path or
// an animated width, because Rule 6 allows transform and opacity only. The
// curtain is a full-size overflow-hidden box displaced by `d` along the active
// axis; the image inside it is displaced by `-d`, which parks it back over the
// desaturated original. The window that survives the clip is the overlap of the
// two boxes - a hard boundary, moved without touching layout.
//
// `d` is signed, and its sign is what makes the direction general. With `edge`
// the pointer's distance from the box's leading side (0..size):
//
//   entered right or bottom -> d = edge        closed at d = +size
//   entered left or top     -> d = edge - size closed at d = -size
//
// so the surviving window is [edge, size] in the first case and [0, edge] in
// the second. Both are "between the entry edge and the pointer".
//
// The trail comes from createAnimatable, whose per-property duration and ease
// interpolate towards each new target. Writing the transform straight from the
// pointer position would give a rigid edge; the recording shows an exponential
// settle behind the cursor (see the pointerWipe preset for the measurement).
//
// Gated the same two ways as usePointerFollow: off under reduced motion, and
// off on coarse pointers where there is no cursor to chase. In both cases the
// curtain never leaves opacity 0 and the desaturated portrait - already the
// element's authored final state - is all that renders.
export const usePointerWipe = ({
  settings = pointerWipe(),
  enter = wipeIn(),
  leave = wipeOut(),
} = {}) => {
  const containerRef = useRef(null);
  const curtainRef = useRef(null);
  const contentRef = useRef(null);

  // Captured on first render, matching the contract of the other animation
  // hooks: the config is fixed for the life of the element.
  const configRef = useRef({ settings, enter, leave });

  useEffect(() => {
    const container = containerRef.current;
    const curtain = curtainRef.current;
    const content = contentRef.current;

    if (!container || !curtain || !content || shouldReduceMotion()) {
      return undefined;
    }
    if (!window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    const config = configRef.current;

    let curtainMove = null;
    let contentMove = null;
    // All resolved on pointerenter so pointermove never reads layout
    // (test.md 8) and never re-decides the direction mid-hover.
    let bounds = null;
    let axis = 'x';
    let size = 0;
    // The leading side's coordinate, and how much to bias `d` by so the colour
    // lands on the side the pointer came from.
    let origin = 0;
    let bias = 0;

    // createAnimatable accepts a property's duration either as a bare number or
    // inside an options object; both forms are read back the same way here.
    const durationOf = (value) =>
      typeof value === 'number' ? value : (value?.duration ?? 0);
    // Read per axis rather than once, so a caller that damps x and y
    // differently gets the duration belonging to the axis actually in use.
    const settle = {
      x: durationOf(config.settings.x),
      y: durationOf(config.settings.y),
    };

    // Registering the opacity switch as a scope method keeps every animation
    // this hook starts inside one scope, so the single revert() below tears all
    // of it down and restores the inline styles it wrote.
    const scope = createScope({ root: container }).add((self) => {
      curtainMove = createAnimatable(curtain, config.settings);
      contentMove = createAnimatable(content, config.settings);
      self.add('reveal', (params) => animate(curtain, params));
    });

    // Writes the active axis and parks the idle one, so a hover that comes in
    // from the top does not inherit a leftover horizontal offset from the last
    // one that came in from the right.
    const displace = (value, duration) => {
      const idle = axis === 'x' ? 'y' : 'x';
      curtainMove?.[axis](value, duration);
      contentMove?.[axis](-value, duration);
      curtainMove?.[idle](0, 0);
      contentMove?.[idle](0, 0);
    };

    const displacementFor = (event) => {
      const along = axis === 'x' ? event.clientX : event.clientY;
      const edge = Math.min(Math.max(along - origin, 0), size);
      return edge - bias;
    };

    const handleEnter = (event) => {
      bounds = container.getBoundingClientRect();

      const side = entrySide(event, bounds);
      const horizontal = side === 'left' || side === 'right';

      axis = horizontal ? 'x' : 'y';
      size = horizontal ? bounds.width : bounds.height;
      origin = horizontal ? bounds.left : bounds.top;
      // Entering through the leading side (left or top) puts the colour behind
      // the pointer instead of ahead of it, which is the negative bias.
      bias = side === 'left' || side === 'top' ? size : 0;

      // Park the curtain closed against the entry edge with duration 0 before
      // showing the layer, so the colour eases in from the rim of the frame
      // instead of appearing whole. This is what the recording does on entry.
      displace(bias ? -size : size, 0);
      scope.methods.reveal(config.enter);
      displace(displacementFor(event), settle[axis]);
    };

    const handleMove = (event) => {
      if (!bounds) {
        return;
      }
      displace(displacementFor(event), settle[axis]);
    };

    const handleLeave = () => {
      bounds = null;
      scope.methods.reveal(config.leave);
    };

    container.addEventListener('pointerenter', handleEnter);
    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);

    return () => {
      container.removeEventListener('pointerenter', handleEnter);
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      scope.revert();
    };
  }, []);

  return { containerRef, curtainRef, contentRef };
};

export default usePointerWipe;
