'use client';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JobApplication, ApplicationStatus, CVVariant } from '@/lib/cv-types';
import {
  loadApplications,
  saveApplication,
  deleteApplication,
  newApplication,
  loadLibrary,
  setActiveVariant,
} from '@/lib/cv-storage';

const STATUSES: ApplicationStatus[] = ['draft', 'applied', 'interview', 'offer', 'rejected'];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: 'text-zinc-500',
  applied: 'text-blue-600',
  interview: 'text-violet-700',
  offer: 'text-emerald-600',
  rejected: 'text-red-500',
};

function ApplicationForm({
  initial,
  variants,
  onDone,
}: {
  initial: JobApplication;
  variants: CVVariant[];
  onDone: () => void;
}) {
  const [app, setApp] = useState(initial);
  const input = 'mt-1 w-full border border-zinc-300 rounded px-3 py-1.5 text-sm bg-white';

  function set<K extends keyof JobApplication>(key: K, value: JobApplication[K]) {
    setApp(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="text-sm text-zinc-600">
        Company
        <input className={input} value={app.company} onChange={e => set('company', e.target.value)} />
      </label>
      <label className="text-sm text-zinc-600">
        Role
        <input className={input} value={app.role} onChange={e => set('role', e.target.value)} />
      </label>
      <label className="text-sm text-zinc-600">
        Job posting URL
        <input className={input} value={app.url} onChange={e => set('url', e.target.value)} />
      </label>
      <label className="text-sm text-zinc-600">
        Applied date
        <input type="date" className={input} value={app.appliedDate} onChange={e => set('appliedDate', e.target.value)} />
      </label>
      <label className="text-sm text-zinc-600">
        Status
        <select className={input} value={app.status} onChange={e => set('status', e.target.value as ApplicationStatus)}>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-zinc-600">
        CV variant
        <select className={input} value={app.cvId ?? ''} onChange={e => set('cvId', e.target.value || null)}>
          <option value="">— none —</option>
          {variants.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-zinc-600 sm:col-span-2">
        Notes
        <textarea className={`${input} min-h-20`} value={app.notes} onChange={e => set('notes', e.target.value)} />
      </label>
      <div className="sm:col-span-2 flex gap-2 justify-end">
        <button onClick={onDone} className="px-4 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          Cancel
        </button>
        <button
          onClick={() => { saveApplication(app); onDone(); }}
          className="px-4 py-1.5 bg-violet-700 text-white text-sm font-medium rounded-lg hover:bg-violet-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<JobApplication[] | null>(null);
  const [variants, setVariants] = useState<CVVariant[]>([]);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setApps(loadApplications());
    setVariants(loadLibrary());
  }, []);

  if (!apps) return null;

  const sorted = [...apps].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));

  function refresh() {
    setApps(loadApplications());
  }

  function setStatus(app: JobApplication, status: ApplicationStatus) {
    saveApplication({ ...app, status });
    refresh();
  }

  function openCV(cvId: string) {
    setActiveVariant(cvId);
    router.push('/cv/edit');
  }

  function remove(app: JobApplication) {
    if (!window.confirm(`Delete application to ${app.company || 'this company'}?`)) return;
    deleteApplication(app.id);
    refresh();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <button
          onClick={() => setEditing(newApplication())}
          className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors font-medium"
        >
          New application
        </button>
      </div>

      {editing && (
        <ApplicationForm
          initial={editing}
          variants={variants}
          onDone={() => { setEditing(null); refresh(); }}
        />
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-zinc-400">No applications yet. Click “New application” to add your first one.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-200">
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Applied</th>
              <th className="py-2 pr-4">CV</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map(app => {
              const cv = variants.find(v => v.id === app.cvId);
              return (
                <Fragment key={app.id}>
                  <tr
                    className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  >
                    <td className="py-2.5 pr-4 font-medium text-zinc-800">{app.company || '—'}</td>
                    <td className="py-2.5 pr-4 text-zinc-600">{app.role || '—'}</td>
                    <td className="py-2.5 pr-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={app.status}
                        onChange={e => setStatus(app, e.target.value as ApplicationStatus)}
                        className={`border border-zinc-200 rounded px-2 py-1 text-xs bg-white font-medium ${STATUS_COLORS[app.status]}`}
                        aria-label={`Status for ${app.company || 'application'}`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 pr-4 text-zinc-500">{app.appliedDate}</td>
                    <td className="py-2.5 pr-4" onClick={e => e.stopPropagation()}>
                      {cv ? (
                        <button onClick={() => openCV(cv.id)} className="text-violet-700 hover:underline">
                          {cv.name}
                        </button>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setEditing(app)} className="text-xs text-zinc-400 hover:text-zinc-800 mr-3 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => remove(app)} className="text-xs text-zinc-400 hover:text-red-500 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expanded === app.id && (
                    <tr className="border-b border-zinc-100 bg-zinc-50">
                      <td colSpan={6} className="py-3 px-4 text-zinc-600">
                        {app.url && (
                          <a href={app.url} target="_blank" rel="noreferrer" className="text-violet-700 hover:underline block mb-1 break-all">
                            {app.url}
                          </a>
                        )}
                        <p className="whitespace-pre-wrap">{app.notes || 'No notes.'}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
