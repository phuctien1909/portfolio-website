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
          <span className="text-sm font-medium text-zinc-700">{label}</span>
          <input
            type={type ?? 'text'}
            value={(value[key] as string) ?? ''}
            onChange={e => onChange({ ...value, [key]: e.target.value })}
            className="mt-1 block w-full border border-zinc-300 rounded-md px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>
      ))}

      {/* Portrait avatar */}
      <div>
        <span className="text-sm font-medium text-zinc-700">Portrait Photo (optional)</span>
        <div className="mt-1 flex items-center gap-3">
          {value.avatar ? (
            <img src={value.avatar} alt="Portrait" className="w-20 h-28 rounded-lg object-cover border border-zinc-200 shadow-sm" />
          ) : (
            <div className="w-20 h-28 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-[11px] text-center leading-tight px-2 border border-dashed border-zinc-300">
              No photo
            </div>
          )}
          <label className="cursor-pointer px-3 py-1.5 border border-zinc-300 rounded-md text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
            {value.avatar ? 'Change photo' : 'Upload photo'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                // Resize to max 400px JPEG@0.85 — preserves quality while keeping base64 under ~100KB
                const objectUrl = URL.createObjectURL(file);
                const img = new window.Image();
                img.onload = () => {
                  const MAX = 400;
                  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
                  const canvas = document.createElement('canvas');
                  canvas.width = Math.round(img.naturalWidth * scale);
                  canvas.height = Math.round(img.naturalHeight * scale);
                  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
                  URL.revokeObjectURL(objectUrl);
                  onChange({ ...value, avatar: canvas.toDataURL('image/jpeg', 0.85) });
                };
                img.src = objectUrl;
              }}
            />
          </label>
          {value.avatar && (
            <button
              type="button"
              onClick={() => onChange({ ...value, avatar: '' })}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
