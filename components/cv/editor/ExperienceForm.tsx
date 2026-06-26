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

  return (
    <div className="space-y-6">
      {value.map((exp, idx) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Position #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(e => e.id !== exp.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['role', 'company', 'location'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">{field}</span>
              <input
                value={exp[field]}
                onChange={e => patch(exp.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-gray-600">
                  {field === 'startDate' ? 'Start' : 'End (or "Present")'}
                </span>
                <input
                  value={exp[field]}
                  onChange={e => patch(exp.id, { [field]: e.target.value })}
                  placeholder={field === 'endDate' ? 'Present' : ''}
                  className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600">Bullet Points</span>
            {exp.bullets.map((b, i) => (
              <div key={i} className="flex gap-2 mt-1.5">
                <input
                  value={b}
                  onChange={e => {
                    const bullets = exp.bullets.map((x, j) => (j === i ? e.target.value : x));
                    patch(exp.id, { bullets });
                  }}
                  placeholder="Describe an achievement or responsibility…"
                  className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => patch(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  aria-label="Remove bullet"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => patch(exp.id, { bullets: [...exp.bullets, ''] })}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              + Add bullet
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Position
      </button>
    </div>
  );
}
