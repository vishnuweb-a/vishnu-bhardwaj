import { profile } from './profile';

// The reference rail carries four pills. The rail renders whatever this array
// holds, so adding or removing a destination is a one-line change here with no
// JSX edit. The LinkedIn href is the canonical profile URL with the share
// tracking parameters stripped -- those are per-share and would rot.
export const socials = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/vishnuweb-a',
    icon: 'github',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vishnu-bhardwaj-81006b382',
    icon: 'linkedin',
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: 'mail',
    external: false,
  },
  {
    id: 'phone',
    label: 'Phone',
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    icon: 'phone',
    external: false,
  },
];

export default socials;
