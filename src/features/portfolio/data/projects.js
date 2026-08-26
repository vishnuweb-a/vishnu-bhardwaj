// Two derivatives per capture (scripts/build-assets.py): `Card` is the 16:9
// composition with the device whole on its own ground, for the card, service
// and experience frames; `Shot` is the capture itself, shown complete on the
// detail route.
import shipBiharCard from '@/assets/images/ship-bihar-card.webp';
import shipBiharShot from '@/assets/images/ship-bihar.webp';
import yarnviaCard from '@/assets/images/yarnvia-card.webp';
import yarnviaShot from '@/assets/images/yarnvia.webp';
import fossClubCard from '@/assets/images/foss-club-card.webp';
import fossClubShot from '@/assets/images/foss-club.webp';
import furnitureCard from '@/assets/images/furniture-card.webp';
import furnitureShot from '@/assets/images/furniture.webp';
import expenseTrackerCard from '@/assets/images/expense-tracker-card.webp';
import expenseTrackerShot from '@/assets/images/expense-tracker.webp';

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
//   thumbnail   the 16:9 card composition; null renders ProjectCover instead
//   images      the detail page's stacked media frames; each entry may set
//               `fit`, because every capture supplied so far is a tall device
//               frame that has to be contained rather than cropped at 4:3
//   caption     the detail page's closing note
//   liveUrl     omitted where there is no public destination
//
// Five of the ten carry a real capture from information/source-assets/. The
// other five have no interface capture on record: their cards render
// ProjectCover, a typographic cover built from the project's own name and
// stack, and their `images` arrays stay empty. Neither borrows another
// project's screenshot, and neither uses a stock photograph - a card in
// Selected Work reads as a picture of the thing that was built.
//
// Curation, reviewed and re-confirmed in Phase 4. Three things are deliberately
// absent from this array, and each is a decision rather than an oversight:
//
//   ats.png - an ATS Kingston Heath site-visit enquiry page. It matches the
//     Real_Estate_Agent repository, which information/project.js files under
//     `projectUnderDevelopment` alongside a second contributor and with no tech
//     stack recorded. Under development, collaborative, and with no shipped
//     status establishable from any source: all three of the brief's exclusion
//     conditions hold, so it is not presented here. Selected Work has no
//     in-progress state to put it in either - the badge vocabulary the
//     reference establishes is 'Real Project' and 'Exploration', both of which
//     read as finished, and inventing a third would be inventing design. Adding
//     one is a design.md change first, a data change second.
//
//   petai - excluded for the same reason: `projectUnderDevelopment`, with a
//     second contributor.
//
//   FastAPI Authentication Microservice, Smart Queue Management System and
//     Kids Garden - on the resume, absent here. Not for want of a capture:
//     Code RAG, Deploy Platform and ORBII have none either and ship on
//     ProjectCover. The reason is curation. The reference grid presents a
//     chosen subset, this array is already ten against its four, and the three
//     omitted are backend services whose territory - JWT/RBAC auth, Redis
//     queueing, FastAPI CRUD - is already represented by ShipBihar and Code
//     RAG. Adding them would lengthen the grid without widening it. They are a
//     data-only change if the owner wants them.

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
    thumbnail: shipBiharCard,
    thumbnailAlt: 'ShipBihar shipment booking interface',
    images: [
      {
        src: shipBiharShot,
        alt: 'ShipBihar home screen on mobile, showing the courier booking entry point',
        fit: 'contain',
      },
    ],
    caption:
      'The interesting problem was reconciliation: payments, provider responses and shipment status all arrive at different times, so the wallet and the queue had to agree on a single source of truth.',
    liveUrl: 'https://github.com/vishnuweb-a/aggregator-software',
  },
  {
    // Classification checked in Phase 4. The capture itself settles the
    // category: information/source-assets/yarnvia.png is an apparel storefront
    // under the Yarnvia wordmark - search, Shop All / Men / Women / Children,
    // a featured collection, a cart with a count, and a Home/Shop/Orders/Cart
    // tab bar. It is an e-commerce front end on the evidence, not on a
    // resemblance.
    //
    // What remains an inference is the linkage: the resume records exactly one
    // e-commerce project ('Scalable E-commerce Platform - Production
    // Application', ~1,000 requests/hour, a reported 20 percent growth
    // improvement) and the owner supplied exactly one e-commerce capture, and
    // no source names the two together - Yarnvia does not appear in
    // information/project.js at all. Pairing them is the only reading the two
    // sources allow, so the record's own title and figures are kept verbatim
    // and the product is named as the capture names it. Nothing here is
    // invented; if Yarnvia is a different storefront, this entry's title and
    // figures are what need correcting (rule.md Rule 22).
    slug: 'scalable-ecommerce-platform',
    name: 'Yarnvia',
    title: 'Yarnvia - Scalable E-commerce Platform',
    category: 'Real Project',
    tags: ['Production', 'Infrastructure'],
    summary:
      'A production apparel storefront handling roughly a thousand requests an hour, deployed and maintained end to end.',
    description:
      'A commerce application taken from local development to a live host: application code, hosting, domain and DNS configuration, and the production environment around it. It sustained approximately 1,000 requests per hour and the work contributed to a reported 20 percent growth improvement.',
    service: 'Application work, deployment, production infrastructure',
    role: 'Developer and operator',
    tools: ['Node.js', 'MongoDB', 'Nginx', 'Linux', 'DNS'],
    thumbnail: yarnviaCard,
    thumbnailAlt:
      'Yarnvia storefront on mobile, showing search, category navigation and a featured collection',
    images: [
      {
        src: yarnviaShot,
        alt: 'Yarnvia home screen with search, category navigation, a featured collection and the cart',
        fit: 'contain',
      },
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
    tools: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Postgres',
      'Recharts',
      'Gemini',
    ],
    thumbnail: null,
    thumbnailAlt: 'SentinelMind decision dashboard',
    images: [],
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
    tools: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Zod',
      'Supabase',
      'Cloudinary',
    ],
    thumbnail: null,
    thumbnailAlt: 'Nycom studio landing page',
    images: [],
    caption:
      'Validating at the edges with Zod meant the Supabase layer could stay thin, and the media pipeline never had to guess what it was being handed.',
    liveUrl: 'https://github.com/vishnuweb-a/nycom',
  },
  {
    slug: 'foss-club-website',
    name: 'FOSS Club',
    title: 'FOSS Club - Open Source Community Site',
    category: 'Real Project',
    tags: ['Frontend', 'Community'],
    summary:
      'A site for an open source club, built around a four-step path from first contribution onwards.',
    description:
      'A community site for a free and open source software club. The landing view is set in a terminal idiom - monospaced, bracketed, over a dark field - and lays the club out in four numbered steps: learn the foundations, build something real, contribute in public, grow together. It is a React 19 application on Vite, typed throughout, with Tailwind CSS 4 for the interface.',
    service: 'Frontend architecture and interface build',
    role: 'Sole developer',
    tools: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4'],
    thumbnail: fossClubCard,
    thumbnailAlt:
      'FOSS Club landing view with its terminal-styled introduction',
    images: [
      {
        src: fossClubShot,
        alt: 'FOSS Club landing view on mobile, showing the four-step introduction',
        fit: 'contain',
      },
    ],
    caption:
      'The terminal framing does real work here: a club that asks people to contribute in public reads better in the idiom its members already write in.',
    // information/project.js lists https://github.com/vishnuweb-a/Foss-webpage-
    // for this repository, but it returns 404 unauthenticated - it is private or
    // not yet pushed. Shipping it would be a dead Live Preview button, so the
    // project renders without one until the repository is public.
    liveUrl: null,
  },
  {
    slug: 'furniture-display',
    name: 'Furniture Display',
    title: 'Furniture Display - Product Landing Page',
    category: 'Real Project',
    tags: ['Frontend', 'Landing Page'],
    summary:
      'A single-page storefront for a furniture maker, routed to WhatsApp and a phone call rather than a checkout.',
    description:
      'A landing page for a furniture business selling bunk beds, single beds, study tables, desk benches and writing chairs into homes, hostels and classrooms. There is no cart: the page carries a persistent contact bar so an enquiry goes straight to WhatsApp or a phone call, which is how the business actually takes orders.',
    service: 'Landing page build and enquiry flow',
    role: 'Sole developer',
    tools: ['Python', 'JavaScript', 'CSS'],
    thumbnail: furnitureCard,
    thumbnailAlt:
      'Furniture landing page with its product headline and enquiry bar',
    images: [
      {
        src: furnitureShot,
        alt: 'Furniture landing page on mobile, showing the headline and the persistent enquiry bar',
        fit: 'contain',
      },
    ],
    caption:
      'Skipping the checkout was the right call. The shortest path to a sale here is a message, so the whole page is arranged to produce one.',
    // Same as FOSS Club: the repository URL on record 404s unauthenticated, so
    // no Live Preview button is rendered.
    liveUrl: null,
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
    images: [],
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
    images: [],
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
    images: [],
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
      'A mobile expense tracker built on React Native and Expo, with Expo Router handling navigation and TypeScript covering the data model. The home view carries the month balance, income and expense totals, a spend breakdown by category and a recent transaction list.',
    service: 'Mobile application, navigation, local persistence',
    role: 'Sole developer',
    tools: ['React Native', 'Expo', 'TypeScript', 'Expo Router'],
    thumbnail: expenseTrackerCard,
    thumbnailAlt:
      'Expense tracker home screen with the month balance and recent transactions',
    images: [
      {
        src: expenseTrackerShot,
        alt: 'Expense tracker home screen showing balance, category breakdown and recent transactions',
        fit: 'contain',
      },
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
