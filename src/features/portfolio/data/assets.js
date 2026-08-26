import portrait from '@/assets/images/portrait.webp';
import avatar from '@/assets/images/avatar.webp';

// Central asset manifest.
//
// The owner's real media arrived as full-size PNGs (roughly 10 MB across seven
// files). Shipping those directly would have made the hero's LCP image alone
// 1.9 MB, so `scripts/build-assets.py` derives a WebP for every one into
// `src/assets/images/`: same pixel dimensions for the screenshots, a
// head-and-shoulders crop for the hero cutout, and a square face crop for the
// footer pill. The derivatives total roughly 390 KB and are imported here so
// Vite fingerprints and cache-busts them.
//
// The originals stay untouched as the source of truth in
// `information/source-assets/`, which is not served. They started out in
// `public/`, where Vite copied all 10 MB into every build even though no page
// ever requests them; Phase 4 moved them out.
//
// Nothing here points at `inspiration/`, which is read-only reference material
// and must never ship as a site asset (rule.md Rule 1).
//
// Every consumer still treats null as "render a neutral local frame at the
// correct aspect ratio", so any slot without a real file is already laid out
// correctly.
export const assets = {
  // Hero cutout: cropped to head, shoulders and upper chest, bottom-anchored
  // over the wordmark's baseline.
  portrait,
  portraitAlt: 'Vishnu Bhardwaj',
  // Footer name pill.
  avatar,
  // Contact section background. The owner supplied no sky or cloud asset, so
  // the .sky-wash CSS approximation in src/styles/index.css still stands in.
  contactBackground: null,
};

export default assets;
