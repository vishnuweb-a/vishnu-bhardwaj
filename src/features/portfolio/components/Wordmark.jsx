import { profile } from '../data';
export const Wordmark = () => (
  <h1
    data-hero-wordmark
    className="font-display text-wordmark leading-[1.06] font-semibold tracking-tight"
  >
    <span className="block text-ink">{profile.firstName}</span>{' '}
    <span className="block text-ink">{profile.lastName}</span>
  </h1>
);

export default Wordmark;
