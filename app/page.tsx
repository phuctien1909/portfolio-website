'use client';
import { useEffect, useState } from 'react';
import { defaultCV } from '@/lib/cv-defaults';
import { loadPortfolioCV } from '@/lib/cv-storage';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { Contact } from '@/components/portfolio/Contact';

export default function Home() {
  const [cv, setCV] = useState(defaultCV);
  useEffect(() => { setCV(loadPortfolioCV()); }, []);

  return (
    <main>
      <Hero personal={cv.personal} skills={cv.skills} />
      <About summary={cv.summary} />
      <ProjectsSection projects={cv.projects} />
      <Contact personal={cv.personal} />
    </main>
  );
}
