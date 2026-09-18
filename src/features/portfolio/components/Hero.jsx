import { Container, Pill } from '@/components/ui';
import { ArrowUpRight, Download } from '@/components/ui/icons';
import { profile } from '../data';
import { useAnimation } from '@/hooks';
import { revealUp } from '@/animations';
import AvailabilityPill from './AvailabilityPill';
import Wordmark from './Wordmark';
import HeroPortrait from './HeroPortrait';
import SocialRail from './SocialRail';
export const Hero = () => {
  const heroRef = useAnimation(
    revealUp({ translateY: [12, 0], duration: 400 })
  );

  return (
    <section
      ref={heroRef}
      id="home"
      aria-label="Introduction"
      className="relative overflow-hidden"
    >
      <Container
        variant="base"
        className="grid items-center gap-10 pt-12 md:grid-cols-2 md:gap-8 md:pt-16 lg:gap-16 lg:pt-20"
      >
        <div className="pb-2 md:pb-16">
          <AvailabilityPill />
          <div className="mt-6">
            <Wordmark />
          </div>
          <p className="mt-5 text-xl leading-tight font-semibold text-ink sm:text-2xl">
            {profile.role}
          </p>
          <p className="mt-4 max-w-[44ch] text-base text-ink-muted">
            {profile.intro}
          </p>
          {/* The primary action keeps its arrow; the resume is a secondary
              download, so it carries the download glyph and the raised tone
              rather than competing as a second solid CTA. */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Pill
              as="a"
              href={profile.contactHref}
              tone="solid"
              size="md"
              className="hover:bg-ink"
            >
              Let&apos;s collaborate
              <ArrowUpRight size={15} />
            </Pill>
            <Pill
              as="a"
              href={profile.resumeHref}
              download
              tone="raised"
              size="md"
              className="hover:border-ink"
            >
              <Download size={15} />
              {profile.resumeLabel}
            </Pill>
          </div>
          <div className="mt-5">
            <SocialRail />
          </div>
        </div>
        <HeroPortrait />
      </Container>
      <Container variant="base">
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-5 text-xs text-ink-muted">
          <span>{profile.experienceSummary}</span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            {profile.location}
          </span>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
