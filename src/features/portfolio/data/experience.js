// The inverted panel's two-column rows (design.md section 12).
//
// Ordered current-first: the ongoing role, then the dated ones in reverse
// chronological order. `period` carries the real range from the owner's record.
//
// `detail` is optional - only the roles with concrete shipped work carry one,
// and ExperienceRow renders nothing when it is absent.
//
// `media` is the hover preview thumbnail. None of these roles has a shipped
// public interface in src/assets/images, so every row renders the neutral frame
// carrying the organisation's name, which is the correct state rather than a
// missing one.
export const experience = [
  {
    id: 'web-bytes',
    organisation: 'Web Bytes',
    role: 'Tech lead',
    period: 'June 2026 - Present',
    detail: null,
    media: null,
    mediaAlt: 'Web Bytes',
  },
  {
    id: 'tech-yantra',
    organisation: 'Tech Yantra',
    role: 'AI engineer',
    period: 'August 2026 - November 2026',
    detail:
      'Building AI-automated estate software and PETAI, an AI-driven mobile application. Launching soon.',
    media: null,
    mediaAlt: 'Tech Yantra',
  },
  {
    id: 'iit-bombay-ecell',
    organisation: 'IIT Bombay, E-Cell',
    role: 'Campus ambassador',
    period: 'May 2026 - August 2026',
    detail: null,
    media: null,
    mediaAlt: 'IIT Bombay E-Cell',
  },
  {
    id: 'zidio',
    organisation: 'Zidio',
    role: 'Backend developer, internship',
    period: 'April 2026 - May 2026',
    detail:
      'Worked on a distributed video-calling system that scaled to 500 concurrent users, built with Redis, microservices, React, the Gemini API, webhooks and Nginx.',
    media: null,
    mediaAlt: 'Zidio',
  },
];

export default experience;
