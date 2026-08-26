import { profile } from '../data';

// Two spans in one h1: the first name outlined with a ~2px stroke over a
// transparent fill, the surname solid (design.md section 9, [measured]).
//
// The stroke is a presentational effect on real text, so both words stay in the
// DOM and are read normally. src/styles/index.css carries an @supports fallback
// that fills the outlined word at reduced opacity where -webkit-text-stroke is
// unavailable, so the name never disappears (design.md section 19).
//
// Below sm the two words stack and are set from a wider vw basis, so each line
// still fills the column instead of the wordmark shrinking to a caption. This
// keeps the design's oversized-display character on a phone rather than
// degrading it to a generic stacked page (design.md section 16 - inferred, as
// the references are desktop-only).
export const Wordmark = () => (
  <h1
    data-hero-wordmark
    className="font-display text-[clamp(2.75rem,18vw,5rem)] leading-[0.9] font-bold tracking-[0.02em] uppercase sm:text-wordmark"
  >
    <span className="block text-outlined sm:inline">{profile.firstName}</span>{' '}
    <span className="block text-ink sm:inline">{profile.lastName}</span>
  </h1>
);

export default Wordmark;
