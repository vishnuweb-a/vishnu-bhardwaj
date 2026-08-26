import { useDocumentTitle } from '@/hooks';
import {
  ContactSection,
  ExperienceSection,
  Hero,
  ProjectsSection,
  ServicesSection,
  profile,
} from '@/features/portfolio';

// Route-level composition only. The page order is the one measured from the
// video's scroll sequence (design.md section 7); no section exists beyond
// these, and none should be invented.
export const Home = () => {
  // Restores the base title when a visitor comes back from a project route.
  useDocumentTitle(profile.documentTitle);

  return (
    <>
      <Hero />
      <ProjectsSection />
      <ServicesSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
};

export default Home;
