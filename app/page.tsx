import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { Contact } from '@/components/portfolio/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectsSection />
      <Contact />
    </main>
  );
}
