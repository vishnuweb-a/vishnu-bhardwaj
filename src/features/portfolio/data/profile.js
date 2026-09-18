// Site owner. Every string the interface renders about the person lives here,
// so the components never hard-code identity (rule.md Rule 8).
export const profile = {
  firstName: 'Vishnu',
  lastName: 'Bhardwaj',
  fullName: 'Vishnu Bhardwaj',
  role: 'Backend Developer',
  // Base document title, and the suffix every route's own title appends to.
  // index.html carries the same string statically for the first paint.
  documentTitle: 'Vishnu Bhardwaj - Backend Developer',
  // Two lines in the hero, matching the reference's role block.
  intro:
    'Building production REST APIs, distributed systems and AI-integrated platforms that hold up under real traffic.',
  availability: 'Available for New Project',
  location: 'Rohtak, Haryana',
  email: 'vb16vishnu@gmail.com',
  phone: '+91 9204734808',
  // Served verbatim from public/, which is the one place a file the browser
  // must fetch by a literal path belongs (CLAUDE.md 3). It is a copy of
  // information/resetup_resume.pdf, which stays the untouched source of truth.
  resumeHref: '/vishnu-bhardwaj-resume.pdf',
  resumeLabel: 'Download Resume',
  // Every CTA on the site resolves here (test.md section 2).
  contactHref: 'mailto:vb16vishnu@gmail.com',
  // The About section. Every line here is assembled from facts already on
  // record elsewhere in this file and in experience.js / projects.js - the
  // role, the intro, the location and the work itself. No biography was
  // written for it, because the repository does not contain one and inventing
  // a personal history is exactly what rule.md Rule 16 forbids. If the owner
  // supplies a bio, it belongs here and the section will render it unchanged.
  about: {
    heading: 'About',
    // Restates the discipline in the owner's own recorded terms rather than
    // narrating a personality.
    lead: 'I work on the parts of a product that have to stay up: the API, the queue, the database and the server it all runs on.',
    // Each of these is verifiable against the data files, not a claim about
    // character. `statLabel` pairs with a count derived at render time.
    notes: [
      'Most of what I build starts as a backend problem - authentication, rate limits, a pipeline that cannot drop work - and the interface follows from it.',
      'The work below is real and shipped or explored end to end, from a courier aggregation backend to a deployment server that provisions its own instances.',
    ],
  },

  // Right-aligned label on the experience heading row.
  experienceSummary: 'Backend, systems and infrastructure',
  contact: {
    heading: 'Have a project in mind?',
    body: 'If you need an API that stays up under load, a queue that does not lose work, or an idea carried from a repository to a running server, I would like to hear about it. Tell me what you are building and where it is stuck.',
    cta: 'Contact Me',
  },
};

export default profile;
