'use client';
import type { PersonalInfo } from '@/lib/cv-types';

const FIELDS: { key: keyof PersonalInfo; label: string; type?: string }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'title', label: 'Job Title / Headline' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'location', label: 'Location (City, Country)' },
  { key: 'website', label: 'Website URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
];

export function PersonalInfoForm({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
}) {
  return (
    <div className="space-y-4">
      {FIELDS.map(({ key, label, type }) => (
        <label key={key} className="block">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <input
            type={type ?? 'text'}
            value={value[key]}
            onChange={e => onChange({ ...value, [key]: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
}
