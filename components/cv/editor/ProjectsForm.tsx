'use client';
import { useState } from 'react';
import type { Project } from '@/lib/cv-types';

function blank(): Project {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    technologies: [],
    url: '',
    location: '',
    teamSize: '',
    role: '',
  };
}

export function ProjectsForm({
  value,
  onChange,
}: {
  value: Project[];
  onChange: (v: Project[]) => void;
}) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  function patch(id: string, delta: Partial<Project>) {
    onChange(value.map(p => (p.id === id ? { ...p, ...delta } : p)));
  }

  function move(from: number, to: number) {
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }

  function addTech(id: string) {
    const tech = (techInputs[id] ?? '').trim();
    if (!tech) return;
    const proj = value.find(p => p.id === id)!;
    if (!proj.technologies.includes(tech)) {
      patch(id, { technologies: [...proj.technologies, tech] });
    }
    setTechInputs(prev => ({ ...prev, [id]: '' }));
  }

  return (
    <div className="space-y-6">
      {value.map((proj, idx) => (
        <div key={proj.id} className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-700">Project #{idx + 1}</span>
              <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move up">↑</button>
              <button onClick={() => move(idx, idx + 1)} disabled={idx === value.length - 1} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move down">↓</button>
            </div>
            <button
              onClick={() => onChange(value.filter(p => p.id !== proj.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['name', 'location', 'url'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-zinc-600 capitalize">
                {field === 'url' ? 'URL (optional)' : field === 'location' ? 'Location (optional)' : field}
              </span>
              <input
                value={proj[field] ?? ''}
                onChange={e => patch(proj.id, { [field]: e.target.value })}
                type={field === 'url' ? 'url' : 'text'}
                className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
              />
            </label>
          ))}
          {(['teamSize', 'role'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-zinc-600">
                {field === 'teamSize' ? 'Team Size (optional)' : 'Role (optional)'}
              </span>
              <input
                value={proj[field] ?? ''}
                onChange={e => patch(proj.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-zinc-600">
                  {field === 'startDate' ? 'Start Date (optional)' : 'End Date (optional)'}
                </span>
                <input
                  value={proj[field] ?? ''}
                  onChange={e => patch(proj.id, { [field]: e.target.value })}
                  placeholder="e.g. 2023"
                  className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
                />
              </label>
            ))}
          </div>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Description</span>
            <textarea
              value={proj.description}
              onChange={e => patch(proj.id, { description: e.target.value })}
              rows={2}
              className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-y"
            />
          </label>
          <div>
            <span className="text-xs font-medium text-zinc-600">Technologies</span>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {proj.technologies.map(t => (
                <span key={t} className="flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {t}
                  <button
                    aria-label={`Remove ${t}`}
                    onClick={() => patch(proj.id, { technologies: proj.technologies.filter(x => x !== t) })}
                    className="text-violet-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={techInputs[proj.id] ?? ''}
                onChange={e => setTechInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id); } }}
                placeholder="React, TypeScript…"
                className="flex-1 border border-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
              />
              <button onClick={() => addTech(proj.id)} className="px-2 py-1 bg-zinc-100 rounded text-xs hover:bg-zinc-200 transition-colors">
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
      >
        + Add Project
      </button>
    </div>
  );
}
