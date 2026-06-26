'use client';
import type { WorkExperience } from '@/lib/cv-types';

function blank(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    bullets: [''],
  };
}

export function ExperienceForm({
  value,
  onChange,
}: {
  value: WorkExperience[];
  onChange: (v: WorkExperience[]) => void;
}) {
  function patch(id: string, delta: Partial<WorkExperience>) {
    onChange(value.map(e => (e.id === id ? { ...e, ...delta } : e)));
  }

  function move(from: number, to: number) {
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }

  return (
    <div className="space-y-6">
      {value.map((exp, idx) => (
        <div key={exp.id} className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-700">Position #{idx + 1}</span>
              <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move up">↑</button>
              <button onClick={() => move(idx, idx + 1)} disabled={idx === value.length - 1} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move down">↓</button>
            </div>
            <button
              onClick={() => onChange(value.filter(e => e.id !== exp.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['role', 'company', 'location'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-zinc-600 capitalize">{field}</span>
              <input
                value={exp[field]}
                onChange={e => patch(exp.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-zinc-600">
                  {field === 'startDate' ? 'Start' : 'End (or "Present")'}
                </span>
                <input
                  value={exp[field]}
                  onChange={e => patch(exp.id, { [field]: e.target.value })}
                  placeholder={field === 'endDate' ? 'Present' : ''}
                  className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </label>
            ))}
          </div>
          <div>
            <span className="text-xs font-medium text-zinc-600">Bullet Points</span>
            {exp.bullets.map((b, i) => (
              <div key={i} className="flex gap-2 mt-1.5">
                <input
                  value={b}
                  onChange={e => {
                    const bullets = exp.bullets.map((x, j) => (j === i ? e.target.value : x));
                    patch(exp.id, { bullets });
                  }}
                  placeholder="Describe an achievement or responsibility…"
                  className="flex-1 border border-zinc-200 rounded px-2 py-1.5 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  onClick={() => patch(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                  className="text-zinc-400 hover:text-red-500 text-lg leading-none"
                  aria-label="Remove bullet"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => patch(exp.id, { bullets: [...exp.bullets, ''] })}
              className="mt-2 text-xs text-violet-600 hover:underline"
            >
              + Add bullet
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
      >
        + Add Position
      </button>
    </div>
  );
}
