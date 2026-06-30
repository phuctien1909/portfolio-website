'use client';
import type { Education } from '@/lib/cv-types';

function blank(): Education {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  };
}

export function EducationForm({
  value,
  onChange,
}: {
  value: Education[];
  onChange: (v: Education[]) => void;
}) {
  function patch(id: string, delta: Partial<Education>) {
    onChange(value.map(e => (e.id === id ? { ...e, ...delta } : e)));
  }

  function move(from: number, to: number) {
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }

  return (
    <div className="space-y-6">
      {value.map((edu, idx) => (
        <div key={edu.id} className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-700">Education #{idx + 1}</span>
              <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move up">↑</button>
              <button onClick={() => move(idx, idx + 1)} disabled={idx === value.length - 1} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move down">↓</button>
            </div>
            <button
              onClick={() => onChange(value.filter(e => e.id !== edu.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['institution', 'degree', 'field'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-zinc-600 capitalize">{field}</span>
              <input
                value={edu[field]}
                onChange={e => patch(edu.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate', 'gpa'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-zinc-600 capitalize">
                  {field === 'gpa' ? 'GPA (optional)' : field === 'startDate' ? 'Start' : 'End'}
                </span>
                <input
                  value={edu[field]}
                  onChange={e => patch(edu.id, { [field]: e.target.value })}
                  className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
}
