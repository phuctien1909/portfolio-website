'use client';
import type { Certificate } from '@/lib/cv-types';

function blank(): Certificate {
  return { id: crypto.randomUUID(), name: '', issuer: '', date: '', url: '' };
}

export function CertificatesForm({
  value,
  onChange,
}: {
  value: Certificate[];
  onChange: (v: Certificate[]) => void;
}) {
  function patch(id: string, delta: Partial<Certificate>) {
    onChange(value.map(c => (c.id === id ? { ...c, ...delta } : c)));
  }

  function move(from: number, to: number) {
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }

  return (
    <div className="space-y-6">
      {value.map((cert, idx) => (
        <div key={cert.id} className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-700">Certificate #{idx + 1}</span>
              <button onClick={() => move(idx, idx - 1)} disabled={idx === 0} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move up">↑</button>
              <button onClick={() => move(idx, idx + 1)} disabled={idx === value.length - 1} className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30 text-base leading-none" title="Move down">↓</button>
            </div>
            <button
              onClick={() => onChange(value.filter(c => c.id !== cert.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Certificate Name</span>
            <input
              value={cert.name}
              onChange={e => patch(cert.id, { name: e.target.value })}
              className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Issuer</span>
            <input
              value={cert.issuer}
              onChange={e => patch(cert.id, { issuer: e.target.value })}
              className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">Date (e.g. 2024)</span>
            <input
              value={cert.date}
              onChange={e => patch(cert.id, { date: e.target.value })}
              className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-600">URL (optional)</span>
            <input
              type="url"
              value={cert.url ?? ''}
              onChange={e => patch(cert.id, { url: e.target.value })}
              className="mt-0.5 block w-full border border-zinc-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white text-zinc-900"
            />
          </label>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
      >
        + Add Certificate
      </button>
    </div>
  );
}
