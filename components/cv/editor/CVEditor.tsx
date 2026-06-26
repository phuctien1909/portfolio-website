'use client';
import { useEffect, useState } from 'react';
import type { CVData } from '@/lib/cv-types';
import { loadCV, saveCV } from '@/lib/cv-storage';
import { CVPreview } from '../CVPreview';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';

const TABS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'] as const;
type Tab = (typeof TABS)[number];

export function CVEditor({ initialData }: { initialData?: Partial<CVData> }) {
  const [cv, setCV] = useState<CVData>(() => ({
    ...loadCV(),
    ...(initialData ?? {}),
  }));
  const [tab, setTab] = useState<Tab>('Personal');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveCV(cv);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [cv]);

  function update(patch: Partial<CVData>) {
    setCV(prev => ({ ...prev, ...patch }));
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {saved && <span className="text-xs text-green-600">Saved</span>}
        </div>

        {tab === 'Personal' && (
          <PersonalInfoForm value={cv.personal} onChange={p => update({ personal: p })} />
        )}
        {tab === 'Summary' && (
          <SummaryForm value={cv.summary} onChange={s => update({ summary: s })} />
        )}
        {tab === 'Experience' && (
          <ExperienceForm value={cv.experience} onChange={e => update({ experience: e })} />
        )}
        {tab === 'Education' && (
          <EducationForm value={cv.education} onChange={e => update({ education: e })} />
        )}
        {tab === 'Skills' && (
          <SkillsForm value={cv.skills} onChange={s => update({ skills: s })} />
        )}
        {tab === 'Projects' && (
          <ProjectsForm value={cv.projects} onChange={p => update({ projects: p })} />
        )}
      </div>

      {/* Live preview — sticky, hidden on small screens */}
      <div className="hidden lg:block w-[440px] shrink-0 border border-gray-200 rounded-lg overflow-auto max-h-[calc(100vh-8rem)] sticky top-20">
        <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-400 font-medium">Live Preview</div>
        <CVPreview data={cv} />
      </div>
    </div>
  );
}
