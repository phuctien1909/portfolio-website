'use client';

export function SummaryForm({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700">Professional Summary</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        placeholder="A short paragraph describing your background, strengths, and goals…"
        className="mt-1 block w-full border border-zinc-300 rounded-md px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
      />
    </label>
  );
}
