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

  return (
    <div className="space-y-6">
      {value.map((edu, idx) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Education #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(e => e.id !== edu.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['institution', 'degree', 'field'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">{field}</span>
              <input
                value={edu[field]}
                onChange={e => patch(edu.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate', 'gpa'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {field === 'gpa' ? 'GPA (optional)' : field === 'startDate' ? 'Start' : 'End'}
                </span>
                <input
                  value={edu[field]}
                  onChange={e => patch(edu.id, { [field]: e.target.value })}
                  className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Education
      </button>
    </div>
  );
}
