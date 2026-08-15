'use client';
import { useState } from 'react';
import type { SkillGroup } from '@/lib/cv-types';

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

const NEW_GROUP = '__new__';

// Swap element i with its neighbour in direction dir (-1 up, +1 down)
function move<T>(arr: T[], i: number, dir: number): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function SkillsForm({
  value,
  onChange,
}: {
  value: SkillGroup[];
  onChange: (v: SkillGroup[]) => void;
}) {
  function updateGroup(id: string, patch: Partial<SkillGroup>) {
    onChange(value.map(g => (g.id === id ? { ...g, ...patch } : g)));
  }

  function addGroup() {
    onChange([...value, { id: newId(), category: '', items: [] }]);
  }

  function removeGroup(id: string) {
    onChange(value.filter(g => g.id !== id));
  }

  function moveGroup(index: number, dir: number) {
    onChange(move(value, index, dir));
  }

  // Move a skill between existing categories (dropdown on each chip)
  function moveSkill(item: string, fromId: string, toId: string) {
    if (fromId === toId) return;
    onChange(
      value.map(g => {
        if (g.id === fromId) return { ...g, items: g.items.filter(s => s !== item) };
        if (g.id === toId) return { ...g, items: g.items.includes(item) ? g.items : [...g.items, item] };
        return g;
      })
    );
  }

  // Move a skill into a brand-new category created on the spot
  function moveSkillToNewGroup(item: string, fromId: string, name: string) {
    const category = name.trim();
    if (!category) return;
    onChange([
      ...value.map(g => (g.id === fromId ? { ...g, items: g.items.filter(s => s !== item) } : g)),
      { id: newId(), category, items: [item] },
    ]);
  }

  return (
    <div className="space-y-4">
      {value.map((group, gi) => (
        <GroupEditor
          key={group.id}
          group={group}
          groups={value}
          isFirst={gi === 0}
          isLast={gi === value.length - 1}
          onChange={patch => updateGroup(group.id, patch)}
          onRemove={() => removeGroup(group.id)}
          onMoveGroup={dir => moveGroup(gi, dir)}
          onMoveSkill={(item, toId) => moveSkill(item, group.id, toId)}
          onMoveSkillToNew={(item, name) => moveSkillToNewGroup(item, group.id, name)}
        />
      ))}
      <button
        onClick={addGroup}
        className="w-full border border-dashed border-zinc-300 rounded-lg py-2 text-sm text-zinc-500 hover:border-violet-400 hover:text-violet-700 transition-colors"
      >
        + Add category
      </button>
    </div>
  );
}

function GroupEditor({
  group,
  groups,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveGroup,
  onMoveSkill,
  onMoveSkillToNew,
}: {
  group: SkillGroup;
  groups: SkillGroup[];
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<SkillGroup>) => void;
  onRemove: () => void;
  onMoveGroup: (dir: number) => void;
  onMoveSkill: (item: string, toId: string) => void;
  onMoveSkillToNew: (item: string, name: string) => void;
}) {
  const [input, setInput] = useState('');

  function addItem() {
    const trimmed = input.trim();
    if (trimmed && !group.items.includes(trimmed)) onChange({ items: [...group.items, trimmed] });
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addItem();
    }
  }

  function editItem(i: number, text: string) {
    onChange({ items: group.items.map((s, idx) => (idx === i ? text : s)) });
  }

  function moveItem(i: number, dir: number) {
    onChange({ items: move(group.items, i, dir) });
  }

  function removeItem(i: number) {
    onChange({ items: group.items.filter((_, idx) => idx !== i) });
  }

  function handleMove(item: string, target: string) {
    if (target === NEW_GROUP) {
      const name = window.prompt('New category name:');
      if (name) onMoveSkillToNew(item, name);
    } else {
      onMoveSkill(item, target);
    }
  }

  const arrowBtn =
    'px-1.5 text-zinc-400 hover:text-violet-700 disabled:opacity-30 disabled:hover:text-zinc-400 text-xs leading-none';

  return (
    <div className="border border-zinc-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex flex-col">
          <button onClick={() => onMoveGroup(-1)} disabled={isFirst} aria-label={`Move ${group.category || 'category'} up`} className={arrowBtn}>▲</button>
          <button onClick={() => onMoveGroup(1)} disabled={isLast} aria-label={`Move ${group.category || 'category'} down`} className={arrowBtn}>▼</button>
        </div>
        <input
          value={group.category}
          onChange={e => onChange({ category: e.target.value })}
          placeholder="Category (e.g. Languages)"
          className="flex-1 border border-zinc-300 rounded-md px-3 py-1.5 text-sm font-medium bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={onRemove}
          className="text-zinc-400 hover:text-red-500 text-sm px-2 py-1"
          aria-label={`Remove ${group.category || 'category'}`}
        >
          Remove
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {group.items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="flex flex-col">
              <button onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label={`Move ${item} up`} className={arrowBtn}>▲</button>
              <button onClick={() => moveItem(i, 1)} disabled={i === group.items.length - 1} aria-label={`Move ${item} down`} className={arrowBtn}>▼</button>
            </div>
            <input
              value={item}
              onChange={e => editItem(i, e.target.value)}
              aria-label={`Edit skill ${item}`}
              className="flex-1 border border-zinc-200 rounded-md px-2.5 py-1 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <select
              value={group.id}
              onChange={e => handleMove(item, e.target.value)}
              aria-label={`Category for ${item}`}
              className="border border-zinc-300 rounded-md px-2 py-1 text-xs bg-white text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.category || 'Untitled'}
                </option>
              ))}
              <option value={NEW_GROUP}>+ New category…</option>
            </select>
            <button
              onClick={() => removeItem(i)}
              className="text-violet-400 hover:text-red-500 font-bold leading-none px-1"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a skill, press Enter"
          className="flex-1 border border-zinc-300 rounded-md px-3 py-2 text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
