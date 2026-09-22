// Ongoing roles first, then dated roles newest-first and undated contributions.
// Dates and shipped-work descriptions come from the existing owner records.
// New undated roles and the development fallback come from the owner's brief.
export const experience = [
  {
    id: 'development',
    role: 'Part-time Web Developer',
    period: '2026 — Present',
    category: 'Product Engineering / Software Development',
    context: 'Frontend and backend workflows',
    timeline: 'NOW',
    timelineLabel: 'Development',
    detail:
      'Building production-ready web features across modern frontend and backend workflows, translating requirements into responsive interfaces and reliable product functionality.',
    technologies: ['React', 'TypeScript', 'Supabase', 'APIs'],
    proof: [
      { title: 'Interfaces', detail: 'Responsive implementation' },
      { title: 'Functionality', detail: 'Frontend and backend integration' },
    ],
  },
  {
    // Webytes is the owner's confirmed spelling; retain the existing role ID.
    id: 'web-bytes',
    organisation: 'Webytes',
    role: 'Tech lead',
    period: 'June 2026 - Present',
    category: 'Technical Leadership / Web',
    context: 'Frontend engineering · Team coordination · Technical execution',
    timeline: 'LEAD',
    timelineLabel: 'Webytes',
    detail:
      'Leading web-related technical work, helping structure implementation decisions and supporting the team in turning ideas into working interfaces.',
    technologies: ['React', 'Frontend', 'UI Engineering', 'Team Leadership'],
  },
  {
    // Present in information/experience.js, but omitted by the previous UI.
    id: 'orbii',
    organisation: 'Orbii',
    role: 'Co-Founder',
    period: '2026 — Present',
    category: 'Leadership / Co-founding',
    timeline: 'FOUND',
    timelineLabel: 'Orbii',
  },
  {
    id: 'tech-yantra',
    organisation: 'Tech Yantra',
    role: 'AI engineer',
    period: 'August 2026 - November 2026',
    category: 'Engineering / AI Product',
    timeline: 'AI',
    timelineLabel: 'Tech Yantra',
    detail:
      'Building AI-automated estate software and PETAI, an AI-driven mobile application. Launching soon.',
    proof: [
      { title: 'Estate software', detail: 'AI automation' },
      { title: 'PETAI', detail: 'AI-driven mobile application' },
    ],
  },
  {
    id: 'iit-bombay-ecell',
    organisation: 'IIT Bombay, E-Cell',
    role: 'Campus ambassador',
    period: 'May 2026 - August 2026',
    category: 'Community / Campus',
    timeline: 'CAMPUS',
    timelineLabel: 'IIT Bombay, E-Cell',
  },
  {
    id: 'zidio',
    organisation: 'Zidio',
    role: 'Backend developer, internship',
    period: 'April 2026 - May 2026',
    category: 'Engineering / Internship',
    timeline: 'BUILD',
    timelineLabel: 'Zidio',
    detail:
      'Worked on a distributed video-calling system that scaled to 500 concurrent users, built with Redis, microservices, React, the Gemini API, webhooks and Nginx.',
    technologies: [
      'Redis',
      'Microservices',
      'React',
      'Gemini API',
      'Webhooks',
      'Nginx',
    ],
    proof: [
      { title: 'Distributed video calling', detail: '500 concurrent users' },
    ],
  },
  {
    id: 'foss-club',
    organisation: 'FOSS Club',
    role: 'Organizer',
    category: 'Community / Open Source',
    context: 'Technical events · Workshops · Community building',
    timeline: 'FOSS',
    timelineLabel: 'Community',
    detail:
      'Organizing technical learning initiatives around open source, Git, GitHub and AI — helping students move from learning concepts to actually building projects.',
    technologies: ['Git', 'GitHub', 'React', 'TypeScript'],
    proof: [
      { title: 'Git & GitHub', detail: 'Developer workflows' },
      { title: 'AI workshops', detail: 'Hands-on learning' },
      { title: 'Buildathons', detail: 'Project execution' },
      {
        title: 'FOSS Club website',
        detail: 'React 19, TypeScript and Tailwind CSS 4',
      },
    ],
  },
  {
    id: 'open-source',
    role: 'Open Source Contributor',
    category: 'Open Source / Web Technology',
    context: 'Web technologies · Community-driven development',
    timeline: 'OSS',
    timelineLabel: 'Web technology',
    detail:
      'Contributing to open-source web technology projects through code, fixes, improvements and collaborative development practices.',
    technologies: ['Git', 'GitHub', 'Web Technologies'],
    workflow: ['Issue', 'Branch', 'Code', 'PR', 'Review', 'Merge'],
  },
];

export default experience;
