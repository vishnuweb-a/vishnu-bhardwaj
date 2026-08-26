// Project records. Adding, removing or reordering an entry here changes the
// grid, the filters, the nav counter, the detail routes and /MORE WORK with no
// JSX edit anywhere (rule.md Rule 8, test.md section 10).
//
// Field notes:
//   slug        the URL segment for /project/:slug - must stay unique and stable
//   name        the short project name; the detail page's h1, as the reference
//               sets a bare name followed by /Category rather than a sentence
//   title       the descriptive title the card carries, up to two lines
//   category    'Real Project' or 'Exploration'; drives the badge and the filters
//   tags        chips under the card title
//   summary     one or two lines on the card and under the detail title
//   description the detail page's opening paragraph
//   service     what the work actually was
//   role        how it was worked on
//   tools       renders as the small tile row in the detail meta stack
//   thumbnail   card image; null renders a neutral frame at the right ratio
//   images      the detail page's stacked media frames
//   caption     the detail page's closing note
//   liveUrl     omitted where there is no public destination

export const PROJECT_CATEGORIES = ['All', 'Real Project', 'Exploration'];

export const projects = [
  {
    slug: 'shipbihar',
    name: 'ShipBihar',
    title: 'ShipBihar - Logistics and Courier Aggregation Backend',
    category: 'Real Project',
    tags: ['Backend', 'Distributed Systems'],
    summary:
      'A courier aggregation backend that prices, books and tracks shipments across multiple providers.',
    description:
      'ShipBihar aggregates several courier providers behind one API. It authenticates users with rotating JWT refresh tokens, prices shipments from a Redis-cached rate table, settles payments through a wallet, and pushes every booking onto a RabbitMQ pipeline so a slow provider never blocks a request.',
    service: 'Backend architecture, payments, async pipeline',
    role: 'Sole backend engineer',
    tools: ['Node.js', 'Express', 'MongoDB', 'Redis', 'RabbitMQ', 'Razorpay'],
    thumbnail: null,
    thumbnailAlt: 'ShipBihar shipment booking interface',
    images: [
      { src: null, alt: 'ShipBihar rate aggregation and AWB generation flow' },
      { src: null, alt: 'ShipBihar wallet and transaction history screen' },
    ],
    caption:
      'The interesting problem was reconciliation: payments, provider responses and shipment status all arrive at different times, so the wallet and the queue had to agree on a single source of truth.',
    liveUrl: 'https://github.com/vishnuweb-a/aggregator-software',
  },
  {
    slug: 'scalable-ecommerce-platform',
    name: 'E-commerce Platform',
    title: 'Scalable E-commerce Platform',
    category: 'Real Project',
    tags: ['Production', 'Infrastructure'],
    summary:
      'A production storefront handling roughly a thousand requests an hour, deployed and maintained end to end.',
    description:
      'A commerce application taken from local development to a live host: application code, hosting, domain and DNS configuration, and the production environment around it. It sustained approximately 1,000 requests per hour and the work contributed to a reported 20 percent growth improvement.',
    service: 'Application work, deployment, production infrastructure',
    role: 'Developer and operator',
    tools: ['Node.js', 'MongoDB', 'Nginx', 'Linux', 'DNS'],
    thumbnail: null,
    thumbnailAlt: 'E-commerce platform storefront',
    images: [
      { src: null, alt: 'E-commerce platform catalogue and checkout flow' },
      { src: null, alt: 'Production hosting and domain configuration' },
    ],
    caption:
      'Most of the value here was operational rather than architectural - knowing what breaks after deployment is a different skill from getting it working locally.',
    liveUrl: null,
  },
  {
    slug: 'sentinelmind',
    name: 'SentinelMind',
    title: 'SentinelMind - AI Decision Review Platform',
    category: 'Real Project',
    tags: ['Full Stack', 'AI'],
    summary:
      'A decision-review tool that stores past calls and uses a language model to surface what changed.',
    description:
      'SentinelMind records decisions and their reasoning, then reads them back with context. It is a Next.js application over Supabase and Postgres, with Google Gemini handling the analysis pass and Recharts rendering the trends.',
    service: 'Product engineering, data model, model integration',
    role: 'Sole developer',
    tools: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Gemini'],
    thumbnail: null,
    thumbnailAlt: 'SentinelMind decision dashboard',
    images: [
      { src: null, alt: 'SentinelMind decision timeline view' },
      { src: null, alt: 'SentinelMind analysis and trend charts' },
    ],
    caption:
      'The hard part was not the model call - it was designing a schema that keeps a decision, its context and its outcome linked well enough to be worth reviewing later.',
    liveUrl: 'https://github.com/vishnuweb-a/hindsight-mvp',
  },
  {
    slug: 'nycom',
    name: 'Nycom',
    title: 'Nycom - Media Studio Platform',
    category: 'Real Project',
    tags: ['Full Stack', 'Deployment'],
    summary:
      'A media studio site with a validated content pipeline and asset delivery through Cloudinary.',
    description:
      'Nycom is a React and Vite application backed by Supabase, with Zod validating every form boundary and Cloudinary handling media transforms and delivery. It runs across Vercel and Hostinger with its own domain configuration.',
    service: 'Frontend architecture, content pipeline, deployment',
    role: 'Sole developer',
    tools: ['React', 'TypeScript', 'Vite', 'Supabase', 'Cloudinary'],
    thumbnail: null,
    thumbnailAlt: 'Nycom studio landing page',
    images: [
      { src: null, alt: 'Nycom portfolio and media gallery' },
      { src: null, alt: 'Nycom content administration screen' },
    ],
    caption:
      'Validating at the edges with Zod meant the Supabase layer could stay thin, and the media pipeline never had to guess what it was being handed.',
    liveUrl: 'https://github.com/vishnuweb-a/nycom',
  },
  {
    slug: 'github-code-rag',
    name: 'Code RAG',
    title: 'GitHub Code RAG System',
    category: 'Exploration',
    tags: ['AI', 'Retrieval'],
    summary:
      'Semantic search over a repository, indexing seventeen thousand code chunks with local inference only.',
    description:
      'A retrieval system that chunks a repository, embeds it into ChromaDB, and answers questions about it through Qwen2.5-Coder running under Ollama. Indexing, semantic search and context-aware retrieval are exposed as FastAPI endpoints, and nothing leaves the machine.',
    service: 'Retrieval architecture, embedding pipeline, API design',
    role: 'Sole developer',
    tools: ['FastAPI', 'ChromaDB', 'Ollama', 'Qwen2.5-Coder'],
    thumbnail: null,
    thumbnailAlt: 'Code retrieval query results',
    images: [
      { src: null, alt: 'Repository indexing and chunking pipeline' },
      { src: null, alt: 'Semantic code search response' },
    ],
    caption:
      'Chunk boundaries decided the quality of every answer. Splitting on syntax rather than line count was the change that made retrieval usable.',
    liveUrl: null,
  },
  {
    slug: 'deployment-platform',
    name: 'Deploy Platform',
    title: 'Personal Deployment Platform',
    category: 'Exploration',
    tags: ['Infrastructure', 'Linux'],
    summary:
      'A deployment server that clones a repository, installs it and provisions a running instance.',
    description:
      'A Node service that takes a repository URL, clones it, installs dependencies, assigns a port and brings the application up under Linux process management. It runs on an AWS EC2 instance configured from scratch: SSH key authentication, networking, reverse proxy, DNS.',
    service: 'Server provisioning, process management, networking',
    role: 'Sole developer',
    tools: ['Node.js', 'Ubuntu', 'Docker', 'AWS EC2', 'SSH'],
    thumbnail: null,
    thumbnailAlt: 'Deployment platform instance list',
    images: [
      { src: null, alt: 'Repository clone and provisioning flow' },
      { src: null, alt: 'Reverse proxy and port assignment configuration' },
    ],
    caption:
      'Building this was the fastest way to understand what a platform-as-a-service is actually doing between a git push and a live URL.',
    liveUrl: null,
  },
  {
    slug: 'orbii',
    name: 'ORBII',
    title: 'ORBII - Voice Keyword Detection',
    category: 'Exploration',
    tags: ['Machine Learning', 'Audio'],
    summary:
      'A low-latency keyword spotter trained to recognise an emergency phrase on edge hardware.',
    description:
      'ORBII turns audio into MFCC and spectrogram features, trains a keyword-spotting model for SOS detection, and serves inference through FastAPI with results streamed back in real time. Training ran on GPU in Colab; inference was optimised to stay usable on constrained devices.',
    service: 'Feature extraction, model training, inference API',
    role: 'Sole developer',
    tools: ['Python', 'FastAPI', 'MFCC', 'Spectrograms'],
    thumbnail: null,
    thumbnailAlt: 'Keyword detection spectrogram view',
    images: [
      { src: null, alt: 'MFCC feature extraction pipeline' },
      { src: null, alt: 'Real-time detection stream output' },
    ],
    caption:
      'Latency, not accuracy, was the constraint. A model that is right two seconds late is not useful for an emergency phrase.',
    liveUrl: null,
  },
  {
    slug: 'expense-tracker',
    name: 'Expense Tracker',
    title: 'Expense Tracker - Mobile Application',
    category: 'Exploration',
    tags: ['Mobile', 'React Native'],
    summary:
      'A React Native expense tracker built with Expo Router and typed end to end.',
    description:
      'A mobile expense tracker built on React Native and Expo, with Expo Router handling navigation and TypeScript covering the data model. Built to learn where mobile state and persistence differ from the web.',
    service: 'Mobile application, navigation, local persistence',
    role: 'Sole developer',
    tools: ['React Native', 'Expo', 'TypeScript', 'Expo Router'],
    thumbnail: null,
    thumbnailAlt: 'Expense tracker summary screen',
    images: [
      { src: null, alt: 'Expense entry and category screens' },
      { src: null, alt: 'Monthly spending summary view' },
    ],
    caption:
      'Expo Router made the navigation tree readable, which mattered more than expected once the app had more than four screens.',
    liveUrl:
      'https://github.com/vishnuweb-a/expense-tracker-mobile-application',
  },
];

export const getProjectBySlug = (slug) =>
  projects.find((project) => project.slug === slug) ?? null;

export const getOtherProjects = (slug, count = 2) =>
  projects.filter((project) => project.slug !== slug).slice(0, count);

export const filterProjects = (category) =>
  !category || category === 'All'
    ? projects
    : projects.filter((project) => project.category === category);

export default projects;
