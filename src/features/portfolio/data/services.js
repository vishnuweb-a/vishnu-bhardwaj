export const services = [
  {
    id: 'web',
    category: '01 / Product Engineering',
    title: ['Full-stack web', 'development.'],
    description:
      'Fast, responsive and scalable web products — from landing experiences to dashboards, portals and complete SaaS platforms.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
    span: 'md:col-span-7',
  },
  {
    id: 'backend',
    category: '02 / Backend',
    title: ['Backend systems', '& APIs.'],
    description:
      'Secure APIs, authentication, databases, RBAC, integrations and backend workflows built for real application use.',
    technologies: ['Node.js', 'FastAPI', 'Supabase', 'PostgreSQL'],
    span: 'md:col-span-5',
  },
  {
    id: 'ai',
    category: '03 / Intelligence',
    title: ['AI apps', '& agents.'],
    description:
      'AI-powered products using LLMs, RAG, intelligent workflows, agents, analysis pipelines and automation.',
    technologies: ['LLMs', 'Gemini', 'RAG', 'Agents'],
    span: 'md:col-span-5',
  },
  {
    id: 'mobile',
    category: '04 / Mobile',
    title: ['Mobile apps', 'that feel native.'],
    description:
      'Cross-platform mobile experiences with authentication, realtime data and backend integration.',
    technologies: ['React Native', 'Expo', 'Clerk', 'Supabase'],
    span: 'md:col-span-7',
  },
  {
    id: 'ui',
    category: '05 / Interface',
    title: ['Frontend & UI implementation'],
    description:
      'Turning designs into responsive, polished, production-ready interfaces.',
    span: 'md:col-span-6',
  },
  {
    id: 'workflows',
    category: '06 / Automation',
    title: ['Integrations & workflows'],
    description:
      'Connecting APIs, services and automation into reliable product workflows.',
    span: 'md:col-span-6',
  },
];

export const serviceTechnologies = [
  'Web Development',
  'AI Products',
  'Mobile Apps',
  'Backend Systems',
  'Supabase',
  'API Integrations',
  'React',
  'TypeScript',
];

export default services;
