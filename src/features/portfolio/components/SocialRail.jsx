import { Pill } from '@/components/ui';
import { GitHub, Mail, Phone, LinkedIn } from '@/components/ui/icons';
import { socials } from '../data';

const ICONS = {
  github: GitHub,
  mail: Mail,
  phone: Phone,
  linkedin: LinkedIn,
};

// Four equal-width pills at a ~79px pitch in the reference. The pills share one
// width with their content left-aligned inside, which is what makes the rail
// read as a single column rather than four ragged chips ([measured]).
//
// The whole rail translates as one group during the entrance; it is not a
// stagger (design.md section 17, row 6).
export const SocialRail = () => (
  <ul
    data-hero-rail
    className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 lg:flex-col lg:items-end lg:gap-[19px]"
  >
    {socials.map((social) => {
      const Icon = ICONS[social.icon] ?? Mail;
      const external = social.external
        ? { target: '_blank', rel: 'noreferrer noopener' }
        : {};

      return (
        <li key={social.id} className="lg:w-[150px]">
          <Pill
            as="a"
            href={social.href}
            tone="raised"
            size="md"
            className="w-full justify-start hover:border-ink"
            {...external}
          >
            <Icon size={16} className="shrink-0 text-ink-muted" />
            {social.label}
          </Pill>
        </li>
      );
    })}
  </ul>
);

export default SocialRail;
