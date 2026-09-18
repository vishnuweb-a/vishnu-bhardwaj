import { GitHub, Mail, Phone, LinkedIn } from '@/components/ui/icons';
import { socials } from '../data';

const ICONS = {
  github: GitHub,
  mail: Mail,
  phone: Phone,
  linkedin: LinkedIn,
};
export const SocialRail = () => (
  <ul data-hero-rail className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {socials.map((social) => {
      const Icon = ICONS[social.icon] ?? Mail;
      const external = social.external
        ? { target: '_blank', rel: 'noreferrer noopener' }
        : {};

      return (
        <li key={social.id}>
          <a
            href={social.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-medium text-ink-muted hover:text-ink hover:underline underline-offset-4"
            {...external}
          >
            <Icon size={16} className="shrink-0 text-ink-muted" />
            {social.label}
          </a>
        </li>
      );
    })}
  </ul>
);

export default SocialRail;
