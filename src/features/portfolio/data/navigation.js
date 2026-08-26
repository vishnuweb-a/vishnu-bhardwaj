import { projects } from './projects';
import { services } from './services';
import { experience } from './experience';

// The navbar's four links. Counters are derived from the data rather than
// written by hand, so they can never drift out of date (rule.md Rule 8).
//
// The reference sets its counters in #AAAAAA, which is 2.3:1 on the near-white
// page and fails WCAG. --color-ink-subtle is darkened to #6E6E6E instead - the
// design defect is fixed rather than reproduced (design.md 19, rule.md Rule 17).
// That value measures 4.97:1 on the canvas, 4.64:1 on --color-surface and
// 5.10:1 on white, so every role using the token passes, not just the nav.
export const navigation = [
  { id: 'work', label: 'Work', href: '#work', count: projects.length },
  { id: 'service', label: 'Service', href: '#service', count: services.length },
  {
    id: 'experience',
    label: 'Experience',
    href: '#experience',
    count: experience.length,
  },
  { id: 'contact', label: 'Contact', href: '#contact', count: null },
];

export default navigation;
