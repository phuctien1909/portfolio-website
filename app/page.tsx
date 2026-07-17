'use client';
import { useEffect, useState } from 'react';
import { defaultCV } from '@/lib/cv-defaults';
import { applyOwnerParam, fetchPublishedCV, loadPortfolioCV } from '@/lib/cv-storage';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { Contact } from '@/components/portfolio/Contact';

export default function Home() {
  const [cv, setCV] = useState(defaultCV);
  useEffect(() => {
    // owner sees their local Master; visitors see the published CV
    if (applyOwnerParam()) setCV(loadPortfolioCV());
    else fetchPublishedCV().then(setCV);
  }, []);

  return (
    <main>
      <Hero personal={cv.personal} skills={cv.skills} />
      <About summary={cv.summary} />
      <ProjectsSection projects={cv.projects} />
      <Contact personal={cv.personal} />
    </main>
  );
}
