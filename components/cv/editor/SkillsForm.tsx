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
        {value.map(skill => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => onChange(value.filter(s => s !== skill))}
              className="ml-1 text-blue-500 hover:text-red-500 font-bold leading-none"
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
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
