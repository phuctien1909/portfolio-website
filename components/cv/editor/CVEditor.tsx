'use client';
import { useEffect, useState } from 'react';
import type { CVData, CVVariant } from '@/lib/cv-types';
import {
  loadCV,
  loadDefaultCV,
  saveCV,
  loadLibrary,
  getActiveVariant,
  setActiveVariant,
  createVariant,
  duplicateVariant,
  renameVariant,
  deleteVariant,
  applicationsUsingVariant,
} from '@/lib/cv-storage';
import { CVPreview } from '../CVPreview';
import { VariantBar } from './VariantBar';
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
  const [variants, setVariants] = useState<CVVariant[]>([]);
  const [activeId, setActiveId] = useState('');
  const [tab, setTab] = useState<Tab>('Personal');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load from localStorage only on client to avoid SSR/client hydration mismatch
  useEffect(() => {
    setVariants(loadLibrary());
    setActiveId(getActiveVariant().id);
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
    if (window.confirm('Discard unsaved changes and revert to last saved CV?')) {
      setCV(loadCV());
      setDirty(false);
      setSaved(false);
    }
  }

  // Reload everything from storage after a variant operation
  function refresh() {
    const lib = loadLibrary();
    const active = getActiveVariant();
    setVariants(lib);
    setActiveId(active.id);
    setCV(active.data);
    setDirty(false);
    setSaved(false);
  }

  function saveIfDirty() {
    if (cv && dirty) saveCV(cv);
  }

  function handleSelect(id: string) {
    saveIfDirty();
    setActiveVariant(id);
    refresh();
  }

  function handleNew() {
    const name = window.prompt('Name for the new CV:');
    if (!name) return;
    saveIfDirty();
    createVariant(name, loadDefaultCV());
    refresh();
  }

  function handleDuplicate() {
    const current = variants.find(v => v.id === activeId);
    const name = window.prompt('Name for the copy:', `${current?.name ?? 'CV'} (copy)`);
    if (!name) return;
    saveIfDirty();
    duplicateVariant(activeId, name);
    refresh();
  }

  function handleRename() {
    const current = variants.find(v => v.id === activeId);
    const name = window.prompt('New name:', current?.name);
    if (!name) return;
    renameVariant(activeId, name);
    setVariants(loadLibrary()); // names only — keep unsaved edits intact
  }

  function handleDelete() {
    const current = variants.find(v => v.id === activeId);
    const affected = applicationsUsingVariant(activeId);
    const suffix = affected.length
      ? `\n\nUsed by ${affected.length} application(s): ${affected.map(a => a.company || '(unnamed)').join(', ')}. They will lose the link.`
      : '';
    if (!window.confirm(`Delete CV "${current?.name}"?${suffix}`)) return;
    deleteVariant(activeId);
    refresh();
  }

  if (!cv) return null;

  return (
    <div className="flex gap-6 items-start">
      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <VariantBar
          variants={variants}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onDelete={handleDelete}
        />
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
