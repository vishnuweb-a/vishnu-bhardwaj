import { Container, Pill } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { useScrollReveal } from '@/hooks';
import { staggerReveal } from '@/animations';
import { assets, profile } from '../data';
import AvailabilityPill from './AvailabilityPill';
import Footer from './Footer';

// A centred call-to-action block over the soft high-key sky, with the panel's
// top corners rounded (design.md section 13).
//
// There is no contact form. The reference has none, and design.md section 13
// and rule.md Rule 4 both forbid inventing one - no inputs, no validation, no
// submit handler. Every CTA on the site resolves to profile.contactHref.
//
// Unlike the clouds in service.webp, this background is genuinely part of the
// design: autocontrast of video t=15.5 confirms cloud detail inside the
// rendered viewport (design.md section 17, row 3).
export const ContactSection = () => {
  const revealRef = useScrollReveal(staggerReveal({ each: 130 }), {
    selector: '[data-reveal-item]',
  });

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate mt-8 overflow-hidden rounded-t-3xl sm:rounded-t-[32px]"
    >
      {assets.contactBackground ? (
        <img
          src={assets.contactBackground}
          alt=""
          width={1440}
          height={900}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="sky-wash absolute inset-0 -z-10" />
      )}

      <Container variant="base" className="py-24 lg:py-32">
        <div ref={revealRef} className="flex flex-col items-center text-center">
          <div data-reveal-item>
            <AvailabilityPill />
          </div>

          <h2
            data-reveal-item
            id="contact-heading"
            className="mt-8 font-display text-display-lg leading-[0.98] font-bold tracking-[0.01em] text-ink uppercase"
          >
            {profile.contact.heading}
          </h2>

          <p
            data-reveal-item
            className="mt-6 max-w-[950px] text-lg text-ink-muted"
          >
            {profile.contact.body}
          </p>

          <div data-reveal-item className="mt-10">
            <Pill
              as="a"
              href={profile.contactHref}
              tone="solid"
              size="lg"
              className="hover:bg-ink"
            >
              {profile.contact.cta}
              <ArrowUpRight size={16} />
            </Pill>
          </div>
        </div>

        <Footer className="mt-24 lg:mt-32" />
      </Container>
    </section>
  );
};

export default ContactSection;
