'use client';
import { useState } from 'react';

export function SkillsForm({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handleDrop(target: number) {
    if (dragIndex !== null && dragIndex !== target) {
      const next = [...value];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(target, 0, moved);
      onChange(next);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  function addSkill() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 min-h-8">
        {value.map((skill, i) => (
          <span
            key={skill}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={e => {
              e.preventDefault(); // required to allow dropping
              if (overIndex !== i) setOverIndex(i);
            }}
            onDrop={e => {
              e.preventDefault();
              handleDrop(i);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-center gap-1 bg-violet-100 text-violet-800 px-2.5 py-1 rounded-full text-sm ${
              dragIndex === i ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
            } ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-2 ring-violet-500' : ''}`}
          >
            {skill}
            <button
              onClick={() => onChange(value.filter(s => s !== skill))}
              className="ml-1 text-violet-400 hover:text-red-500 font-bold leading-none"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a skill and press Enter or comma"
          className="flex-1 border border-zinc-300 rounded-md px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
