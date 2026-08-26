import { Pill } from '@/components/ui';
import { GitHub, Mail, Phone, LinkedIn } from '@/components/ui/icons';
import { assets, profile, socials } from '../data';

const ICONS = {
  github: GitHub,
  mail: Mail,
  phone: Phone,
  linkedin: LinkedIn,
};

// A single row justified across the BASE container ([measured],
// design.md section 14): a solid dark name pill carrying a circular avatar
// inset at its left edge, then the social pills distributed to its right.
//
// No copyright line, no secondary nav, no newsletter - none appear in the
// reference. The footer is reused unchanged on the project detail route.
export const Footer = ({ className = '' }) => (
  <footer className={`flex flex-wrap items-center gap-4 sm:gap-6 ${className}`}>
    <span className="inline-flex h-12 shrink-0 items-center gap-3 rounded-full bg-pill py-1 pr-6 pl-1 text-base font-medium text-white shadow-pill">
      {assets.avatar ? (
        <img
          src={assets.avatar}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/90"
        >
          {profile.firstName[0]}
          {profile.lastName[0]}
        </span>
      )}
      {profile.fullName}
    </span>

    <ul className="flex flex-1 flex-wrap items-center gap-3 sm:gap-4 lg:justify-between lg:gap-6 lg:pl-14">
      {socials.map((social) => {
        const Icon = ICONS[social.icon] ?? Mail;
        const external = social.external
          ? { target: '_blank', rel: 'noreferrer noopener' }
          : {};

        return (
          <li key={social.id}>
            <Pill
              as="a"
              href={social.href}
              tone="raised"
              size="md"
              className="hover:border-ink"
              {...external}
            >
              <Icon size={16} className="shrink-0 text-ink-muted" />
              {social.label}
            </Pill>
          </li>
        );
      })}
    </ul>
  </footer>
);

export default Footer;
