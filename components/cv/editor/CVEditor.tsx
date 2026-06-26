'use client';
import { useEffect, useState } from 'react';
import type { CVData } from '@/lib/cv-types';
import { loadCV, saveCV } from '@/lib/cv-storage';
import { defaultCV } from '@/lib/cv-defaults';
import { CVPreview } from '../CVPreview';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificatesForm } from './CertificatesForm';

const TABS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Projects', 'Certificates'] as const;
type Tab = (typeof TABS)[number];

export function CVEditor({ initialData }: { initialData?: Partial<CVData> }) {
  const [cv, setCV] = useState<CVData | null>(null);
  const [tab, setTab] = useState<Tab>('Personal');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load from localStorage only on client to avoid SSR/client hydration mismatch
  useEffect(() => {
    setCV({ ...loadCV(), ...(initialData ?? {}) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(patch: Partial<CVData>) {
    setCV(prev => prev ? { ...prev, ...patch } : prev);
    setDirty(true);
    setSaved(false);
  }

  function save() {
    if (!cv) return;
    saveCV(cv);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function reset() {
    if (window.confirm('Reset all CV data to blank? This cannot be undone.')) {
      setCV(defaultCV);
      setDirty(true);
      setSaved(false);
    }
  }

  if (!cv) return null;

  return (
    <div className="flex gap-6 items-start">
      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 flex-wrap p-1 bg-zinc-100 rounded-lg">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === t
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {saved && <span className="text-xs text-emerald-600 font-medium">Saved</span>}
            <button
              onClick={reset}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={save}
              disabled={!dirty}
              className="px-4 py-1.5 bg-violet-700 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
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
          {tab === 'Certificates' && (
            <CertificatesForm value={cv.certificates} onChange={c => update({ certificates: c })} />
          )}
        </div>
      </div>

      {/* Live preview — sticky, hidden on small screens */}
      <div className="hidden lg:block w-[480px] shrink-0 rounded-xl overflow-x-hidden overflow-y-auto max-h-[calc(100vh-6rem)] sticky top-20 shadow-md border border-zinc-200">
        <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          Live Preview
        </div>
        <CVPreview data={cv} />
      </div>
    </div>
  );
}
