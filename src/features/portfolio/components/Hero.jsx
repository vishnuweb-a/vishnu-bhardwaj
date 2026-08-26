import { Container, Pill } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { profile } from '../data';
import { useHeroEntrance } from '../hooks/useHeroEntrance';
import Navbar from './Navbar';
import Wordmark from './Wordmark';
import HeroPortrait from './HeroPortrait';
import SocialRail from './SocialRail';

// The three-band composition measured from home.webp and video t=0.8-4.2
// (design.md section 9): navbar at ~56px from the top, the wordmark filling the
// 1280px WIDE column from ~232px, and a lower row in the 1216px BASE column
// carrying the role block left and the social rail right, with the portrait
// cutout centred and bottom-anchored in front of the wordmark's baseline.
//
// The navbar lives inside the hero because it scrolls away with it and never
// returns (design.md section 8) - it is this section's header, not a page-level
// fixed bar.
export const Hero = () => {
  const heroRef = useHeroEntrance();

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden pb-10 lg:pb-14"
    >
      <Navbar />

      <Container variant="wide" className="relative z-20 mt-16 lg:mt-[104px]">
        <Wordmark />
      </Container>

      <HeroPortrait />

      <Container
        variant="base"
        className="relative z-20 mt-auto flex flex-col gap-10 pt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
      >
        {/* The measure narrows at lg and above so the intro clears the
            portrait's shoulder line instead of running under it. The reference
            sets this block at roughly 350px against a narrower cutout. */}
        <div
          data-hero-role
          className="max-w-[380px] lg:max-w-[260px] xl:max-w-[300px]"
        >
          <h2 className="font-body text-[clamp(1.5rem,2.2vw,2rem)] leading-tight font-semibold text-ink">
            {profile.role}
          </h2>
          <p className="mt-3 text-base text-ink-muted">{profile.intro}</p>
          <Pill
            as="a"
            href={profile.contactHref}
            tone="solid"
            size="md"
            className="mt-6 hover:bg-ink"
          >
            Let&apos;s collaborate
            <ArrowUpRight size={15} />
          </Pill>
        </div>

        <SocialRail />
      </Container>
    </section>
  );
};

export default Hero;
