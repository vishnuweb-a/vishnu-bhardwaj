import shipBihar from '@/assets/images/ship-bihar-card.webp';
import yarnvia from '@/assets/images/yarnvia-card.webp';

// The accordion rows (design.md section 10). `media` names the work sample that
// overhangs the expanded panel.
//
// Both frames are 16:9 and both samples are the 16:9 composition built by
// scripts/build-assets.py, so the device sits whole on its own ground with no
// crop at all.
//
// The samples are shipped work by the owner that exercises the service being
// described, not diagrams of it: ShipBihar is the Node/Express service with the
// JWT layer and the RabbitMQ pipeline, and the commerce platform is the one
// that runs in production behind its own domain. The card is decorative and
// aria-hidden, so it makes no claim in text; only one panel is open at a time,
// so a sample appearing under two related services is never seen twice at once.
export const services = [
  {
    id: 'backend',
    title: 'Backend Engineering',
    description:
      'REST APIs, authentication and authorisation, JWT with refresh rotation, RBAC and session handling - built on Node, Express and FastAPI.',
    media: shipBihar,
    mediaAlt: 'ShipBihar, the REST and authentication backend',
  },
  {
    id: 'distributed',
    title: 'Distributed Systems',
    description:
      'RabbitMQ and Redis-backed queues, asynchronous processing pipelines and microservice boundaries that keep slow work off the request path.',
    media: shipBihar,
    mediaAlt: 'ShipBihar, whose shipment pipeline runs on RabbitMQ',
  },
  {
    id: 'data',
    title: 'Data & Caching',
    description:
      'Schema design across MongoDB, PostgreSQL and MySQL, Redis caching and atomic counters, and query paths that stay fast as the table grows.',
    media: yarnvia,
    mediaAlt: 'The commerce platform this catalogue and cart layer serves',
  },
  {
    id: 'infrastructure',
    title: 'Deployment & Infrastructure',
    description:
      'Ubuntu servers, Docker, AWS EC2 and S3, reverse proxies, DNS and domain configuration - taking an application from a repository to a running host.',
    media: yarnvia,
    mediaAlt:
      'The commerce platform running in production behind its own domain',
  },
];

export default services;
