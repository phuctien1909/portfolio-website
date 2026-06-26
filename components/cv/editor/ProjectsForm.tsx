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
        <div key={proj.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Project #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(p => p.id !== proj.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['name', 'url'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">
                {field === 'url' ? 'URL (optional)' : field}
              </span>
              <input
                value={proj[field]}
                onChange={e => patch(proj.id, { [field]: e.target.value })}
                type={field === 'url' ? 'url' : 'text'}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-xs font-medium text-gray-600">Description</span>
            <textarea
              value={proj.description}
              onChange={e => patch(proj.id, { description: e.target.value })}
              rows={2}
              className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </label>
          <div>
            <span className="text-xs font-medium text-gray-600">Technologies</span>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {proj.technologies.map(t => (
                <span key={t} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {t}
                  <button
                    aria-label={`Remove ${t}`}
                    onClick={() => patch(proj.id, { technologies: proj.technologies.filter(x => x !== t) })}
                    className="text-gray-400 hover:text-red-500"
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
                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={() => addTech(proj.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Project
      </button>
    </div>
  );
}
