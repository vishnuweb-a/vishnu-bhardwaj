import { projects } from './projects';

// Section-only curation leaves existing detail routes and their media intact.
// No year or HackPrix stack is recorded in the source data.
export const showcaseProjects = [
  {
    slug: 'petzo',
    name: 'PETZO',
    category: 'Real Project',
    showcaseCategory: 'AI Pet Care / Mobile Application',
    summary:
      'AI-powered pet care application built around intelligent visual analysis and a mobile-first experience.',
    tools: ['React Native', 'Expo', 'Clerk', 'Supabase'],
    githubUrl: 'https://github.com/vishnuweb-a/petai',
    liveUrl: 'https://petai-web-lovat.vercel.app/',
  },
  {
    slug: 'hackprix',
    name: 'HACKPRIX',
    category: 'Real Project',
    showcaseCategory: 'Hackathon Portal',
    summary:
      'Hackathon portal for event information, schedules, registrations, teams and supporting event workflows.',
    tools: [],
    githubUrl: 'https://github.com/vishnuweb-a/hackprix',
    liveUrl: 'https://hackprixfossclub.vercel.app/',
  },
  ...projects.filter((project) => project.slug !== 'orbii'),
];
