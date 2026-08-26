import { profile } from './profile';

// The reference rail carries four pills. Only three destinations are verifiable
// for this owner, and inventing a fourth would mean shipping a link that goes
// nowhere. The rail renders whatever this array holds, so adding LinkedIn or
// any other profile is a one-line change here with no JSX edit.
export const socials = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/vishnuweb-a',
    icon: 'github',
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
