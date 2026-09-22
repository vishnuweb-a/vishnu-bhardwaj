import { showcaseProjects } from '../data/projectShowcase';
import ProjectCarousel from './ProjectCarousel';

export const ProjectsSection = () => (
  <ProjectCarousel projects={showcaseProjects} />
);
export default ProjectsSection;
