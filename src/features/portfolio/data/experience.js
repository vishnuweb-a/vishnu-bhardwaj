// The inverted panel's two-column rows (design.md section 12).
//
// `period` carries what is verifiable from the owner's record rather than an
// invented date range. Replacing each one with a real dated range is a
// data-only change - the component reads whatever string it is given.
export const experience = [
  {
    id: 'ecommerce',
    organisation: 'Scalable E-commerce Platform',
    role: 'Backend and deployment engineer',
    period: 'Production',
    media: null,
    mediaAlt: 'E-commerce platform in production',
  },
  {
    id: 'shipbihar',
    organisation: 'ShipBihar',
    role: 'Backend architect',
    period: 'Independent build',
    media: null,
    mediaAlt: 'ShipBihar courier aggregation backend',
  },
  {
    id: 'mongo-agent-mcp',
    organisation: 'mongo_agent_mcp',
    role: 'Package author, published on PyPI',
    period: 'Open source',
    media: null,
    mediaAlt: 'MongoDB MCP server package',
  },
  {
    id: 'open-source',
    organisation: 'GitHub',
    role: 'Contributor across full-stack and infrastructure repositories',
    period: 'Ongoing',
    media: null,
    mediaAlt: 'Open source repository activity',
  },
  {
    id: 'btech',
    organisation: 'B.Tech Computer Science Engineering',
    role: 'Student, backend and systems focus',
    period: 'In progress',
    media: null,
    mediaAlt: 'Computer science coursework',
  },
];

export default experience;
