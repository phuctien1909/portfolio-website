'use client';
import type { CVVariant } from '@/lib/cv-types';

interface VariantBarProps {
  variants: CVVariant[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function VariantBar({ variants, activeId, onSelect, onNew, onDuplicate, onRename, onDelete }: VariantBarProps) {
  const btn = 'text-xs text-zinc-500 hover:text-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-zinc-500';
  return (
    <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
      <label htmlFor="variant-select" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        CV
      </label>
      <select
        id="variant-select"
        value={activeId}
        onChange={e => onSelect(e.target.value)}
        className="text-sm border border-zinc-300 rounded px-2 py-1 bg-white min-w-40"
      >
        {variants.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <div className="flex gap-3 ml-auto">
        <button onClick={onNew} className={btn}>New</button>
        <button onClick={onDuplicate} className={btn}>Duplicate</button>
        <button onClick={onRename} className={btn}>Rename</button>
        <button
          onClick={onDelete}
          disabled={variants.length <= 1}
          className={`${btn} hover:text-red-500`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
