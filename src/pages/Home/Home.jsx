import { useDocumentTitle } from '@/hooks';
import {
  AboutSection,
  ContactSection,
  ExperienceSection,
  Hero,
  Navbar,
  ProjectsSection,
  ServicesSection,
  profile,
} from '@/features/portfolio';

export const Home = () => {
  // Restores the base title when a visitor comes back from a project route.
  useDocumentTitle(profile.documentTitle);

  return (
    <>
      <Navbar />
      <Hero />
      <ProjectsSection />
      <ServicesSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
};

export default Home;
