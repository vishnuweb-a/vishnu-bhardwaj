// The accordion rows (design.md section 10). `media` names the work sample that
// overhangs the expanded panel; it is null until a real image exists, and
// MediaFrame renders a correctly proportioned neutral block in its place.
export const services = [
  {
    id: 'backend',
    title: 'Backend Engineering',
    description:
      'REST APIs, authentication and authorisation, JWT with refresh rotation, RBAC and session handling - built on Node, Express and FastAPI.',
    media: null,
    mediaAlt: 'Authentication service architecture',
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    description:
      'RabbitMQ and Redis-backed queues, asynchronous processing pipelines and microservice boundaries that keep slow work off the request path.',
    media: null,
    mediaAlt: 'Asynchronous shipment processing pipeline',
  },
  {
    id: 'data',
    title: 'Data & Caching',
    description:
      'Schema design across MongoDB, PostgreSQL and MySQL, Redis caching and atomic counters, and query paths that stay fast as the table grows.',
    media: null,
    mediaAlt: 'Redis-cached pricing and queue layer',
  },
  {
    id: 'infrastructure',
    title: 'Deployment & Infrastructure',
    description:
      'Ubuntu servers, Docker, AWS EC2 and S3, reverse proxies, DNS and domain configuration - taking an application from a repository to a running host.',
    media: null,
    mediaAlt: 'Production deployment topology',
  },
];

export default services;
