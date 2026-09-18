import { Container, Pill } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll } from '@/animations';
import { assets, profile, socials } from '../data';
import AvailabilityPill from './AvailabilityPill';
import Footer from './Footer';

export const ContactSection = () => {
  const revealRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-line bg-surface-raised"
    >
      <Container variant="base">
        <div
          ref={revealRef}
          className="grid items-start gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20 lg:py-20"
        >
          <div className="rounded-lg bg-panel p-7 text-on-panel">
            <div className="flex items-center gap-4">
              <img
                src={assets.avatar}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="size-14 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold">{profile.fullName}</p>
                <p className="text-sm text-on-panel-muted">{profile.role}</p>
              </div>
            </div>
            <p className="mt-7 text-sm text-on-panel-muted">
              {profile.location}
            </p>
            <ul className="mt-3 space-y-2">
              {socials
                .filter(
                  (social) => social.id === 'email' || social.id === 'phone'
                )
                .map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      className="inline-flex min-h-11 items-center break-all rounded-sm text-sm text-on-panel underline decoration-on-panel-muted underline-offset-4 hover:decoration-on-panel"
                    >
                      {social.id === 'email' ? profile.email : profile.phone}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <AvailabilityPill />
            <h2
              id="contact-heading"
              className="mt-5 font-display text-display-lg leading-tight font-medium tracking-tight text-ink"
            >
              {profile.contact.heading}
            </h2>
            <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
              {profile.contact.body}
            </p>
            <Pill
              as="a"
              href={profile.contactHref}
              tone="solid"
              size="lg"
              className="mt-7 hover:bg-ink"
            >
              {profile.contact.cta}
              <ArrowUpRight size={18} />
            </Pill>
          </div>
        </div>
        <Footer />
      </Container>
    </section>
  );
};
export default ContactSection;
