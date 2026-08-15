import { loadCV, saveCV, importJSON, normalizeSkills } from '../lib/cv-storage';
import { defaultCV } from '../lib/cv-defaults';

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });

// Polyfill File.prototype.text() for Jest
if (!File.prototype.text) {
  Object.defineProperty(File.prototype, 'text', {
    value: async function() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(this);
      });
    },
  });
}

beforeEach(() => mockStorage.clear());

test('loadCV returns defaultCV when nothing is stored', () => {
  expect(loadCV()).toEqual(defaultCV);
});

test('saveCV + loadCV round-trips data', () => {
  const cv = { ...defaultCV, summary: 'Test summary' };
  saveCV(cv);
  expect(loadCV().summary).toBe('Test summary');
});

test('loadCV handles corrupted localStorage gracefully', () => {
  mockStorage.setItem('portfolio_cv', '{bad json');
  expect(loadCV()).toEqual(defaultCV);
});

test('importJSON parses a valid JSON file', async () => {
  const data = { ...defaultCV, summary: 'Imported' };
  const file = new File([JSON.stringify(data)], 'cv.json', { type: 'application/json' });
  const result = await importJSON(file);
  expect(result.summary).toBe('Imported');
});

test('importJSON rejects invalid JSON', async () => {
  const file = new File(['not json'], 'cv.json', { type: 'application/json' });
  await expect(importJSON(file)).rejects.toThrow();
});

test('importJSON merges with defaults (missing fields filled in)', async () => {
  const partial = { summary: 'Only summary' };
  const file = new File([JSON.stringify(partial)], 'cv.json', { type: 'application/json' });
  const result = await importJSON(file);
  expect(result.personal).toEqual(defaultCV.personal);
  expect(result.summary).toBe('Only summary');
});

test('normalizeSkills wraps a legacy flat string[] into one group', () => {
  const result = normalizeSkills(['Java', 'Python', '  ', 'SQL']);
  expect(result).toHaveLength(1);
  expect(result[0].category).toBe('Skills');
  expect(result[0].items).toEqual(['Java', 'Python', 'SQL']);
});

test('normalizeSkills keeps grouped data and drops empty groups', () => {
  const result = normalizeSkills([
    { id: 'a', category: 'Languages', items: ['Java'] },
    { id: 'b', category: 'Empty', items: [] },
    { category: 'Tools', items: ['Tosca'] }, // missing id gets one generated
  ]);
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({ id: 'a', category: 'Languages', items: ['Java'] });
  expect(result[1].category).toBe('Tools');
  expect(result[1].id).toBeTruthy();
});

test('importJSON migrates a legacy string[] skills export', async () => {
  const legacy = { ...defaultCV, skills: ['Java', 'Python'] };
  const file = new File([JSON.stringify(legacy)], 'cv.json', { type: 'application/json' });
  const result = await importJSON(file);
  expect(result.skills[0].items).toEqual(['Java', 'Python']);
});
