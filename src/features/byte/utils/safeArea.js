// Where BYTE is allowed to stand.
//
// Deliberately an anchor list rather than real collision detection. The brief
// asked for a basic safe-area system and that is the right call: a general
// rectangle solver would have to re-read layout on every scroll frame to stay
// correct, which is exactly the continuous layout work the performance budget
// forbids. Picking from a handful of known-good anchors costs nothing and is
// wrong in far fewer ways.
//
// All values are viewport coordinates for the pet's top-left corner.

// The navbar is `sticky top-0 z-30` with a min-h-20 nav, so the top 80px of the
// viewport can be covered by it at any scroll position. Nothing goes there.
const NAV_RESERVE = 88;

// Keeps BYTE clear of the very edge so the speech bubble, which renders above
// and beside the body, still has room to lay out on screen.
const EDGE_GUTTER = 20;

export const BYTE_SIZE = { desktop: 104, mobile: 74 };

export const petSize = (isMobile) =>
  isMobile ? BYTE_SIZE.mobile : BYTE_SIZE.desktop;

/**
 * Clamp a position so the whole body stays inside the viewport and below the
 * navbar strip. Every write to BYTE's position passes through this, including
 * drag and throw, so there is no code path that can put it off screen.
 */
export const clampToViewport = (x, y, size) => {
  const maxX = Math.max(EDGE_GUTTER, window.innerWidth - size - EDGE_GUTTER);
  const maxY = Math.max(NAV_RESERVE, window.innerHeight - size - EDGE_GUTTER);
  return {
    x: Math.min(Math.max(x, EDGE_GUTTER), maxX),
    y: Math.min(Math.max(y, NAV_RESERVE), maxY),
  };
};

/**
 * The anchor set. Each entry resolves against the live viewport, so a resize
 * needs no cached geometry - the next wander simply lands in the right place.
 *
 * The lower band is weighted heavily: a companion that spends its time near
 * the floor stays out of the reading column, which is where the body copy and
 * every CTA in this layout live.
 */
export const safeAnchors = (size) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bottom = h - size - EDGE_GUTTER;
  const middle = h * 0.5 - size / 2;

  return [
    { id: 'bottom-left', x: EDGE_GUTTER, y: bottom },
    { id: 'bottom-right', x: w - size - EDGE_GUTTER, y: bottom },
    { id: 'bottom-center', x: w * 0.5 - size / 2, y: bottom },
    { id: 'middle-left', x: EDGE_GUTTER, y: middle },
    { id: 'middle-right', x: w - size - EDGE_GUTTER, y: middle },
  ];
};

// Sections whose interactive content sits centre-stage. During these, BYTE is
// restricted to the bottom band so it can never drift over a project card's
// drag area, a service tile or a contact field.
const CORNER_ONLY = new Set(['work', 'contact']);

// Controls BYTE must never stand on. These are queried live rather than
// hard-coded as rectangles, because their position depends on the section
// that is currently pinned and on the breakpoint.
//
// This exists because the bottom corners - the anchors a companion most wants
// to occupy - are exactly where this layout puts the projects carousel's
// prev/next buttons. Parking there left the pet's body sitting on top of the
// controls, and a click aimed at "next project" hit BYTE instead.
const OBSTACLE_SELECTOR = [
  '#work .projects-footer',
  '#work button',
  'a[href^="#"][class*="pill"]',
  'form',
  'input',
  'textarea',
].join(',');

const OBSTACLE_PADDING = 12;

const overlapsObstacle = (anchor, size) => {
  const box = {
    left: anchor.x - OBSTACLE_PADDING,
    top: anchor.y - OBSTACLE_PADDING,
    right: anchor.x + size + OBSTACLE_PADDING,
    bottom: anchor.y + size + OBSTACLE_PADDING,
  };

  // Only elements currently on screen can be collided with, and there are a
  // handful of them, so this stays cheap - it runs once per wander, not per
  // frame.
  const nodes = document.querySelectorAll(OBSTACLE_SELECTOR);
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const clear =
      box.right < rect.left ||
      box.left > rect.right ||
      box.bottom < rect.top ||
      box.top > rect.bottom;
    if (!clear) return true;
  }
  return false;
};

export const anchorsForSection = (sectionId, size, isMobile) => {
  const all = safeAnchors(size);
  const base =
    CORNER_ONLY.has(sectionId) || isMobile
      ? // Mobile gets the same treatment unconditionally: the viewport is
        // narrow enough that the middle anchors would sit on the content
        // column. `bottom-center` is kept as a fallback for the case where
        // both corners are occupied by controls.
        all.filter(
          (anchor) =>
            anchor.id !== 'middle-left' && anchor.id !== 'middle-right'
        )
      : all;

  const free = base.filter((anchor) => !overlapsObstacle(anchor, size));
  // If every anchor is blocked, staying put beats standing on a button.
  return free.length > 0 ? free : [];
};

/**
 * Pick a new anchor, never the one already occupied - re-selecting the current
 * spot would show as BYTE pausing for no reason.
 */
export const pickAnchor = (anchors, currentId) => {
  const options = anchors.filter((anchor) => anchor.id !== currentId);
  const pool = options.length > 0 ? options : anchors;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Trip length scales with distance, inside the 700-1300ms band the brief set.
export const travelDuration = (dx, dy) => {
  const distance = Math.hypot(dx, dy);
  const reference = Math.hypot(window.innerWidth, window.innerHeight) || 1;
  return Math.round(700 + Math.min(1, distance / reference) * 600);
};
