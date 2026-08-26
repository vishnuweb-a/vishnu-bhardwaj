// Site owner. Every string the interface renders about the person lives here,
// so the components never hard-code identity (rule.md Rule 8).
export const profile = {
  firstName: 'Vishnu',
  lastName: 'Bhardwaj',
  fullName: 'Vishnu Bhardwaj',
  role: 'Backend Developer',
  // Two lines in the hero, matching the reference's role block.
  intro:
    'Building production REST APIs, distributed systems and AI-integrated platforms that hold up under real traffic.',
  availability: 'Available for New Project',
  location: 'Rohtak, Haryana',
  email: 'vb16vishnu@gmail.com',
  phone: '+91 9204734808',
  // Every CTA on the site resolves here (test.md section 2).
  contactHref: 'mailto:vb16vishnu@gmail.com',
  // Right-aligned label on the experience heading row.
  experienceSummary: 'Backend, systems and infrastructure',
  contact: {
    heading: 'Have a project in mind?',
    body: 'If you need an API that stays up under load, a queue that does not lose work, or an idea carried from a repository to a running server, I would like to hear about it. Tell me what you are building and where it is stuck.',
    cta: 'Contact Me',
  },
};

export default profile;
