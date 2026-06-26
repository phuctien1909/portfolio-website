import { loadCV, saveCV, importJSON } from '../lib/cv-storage';
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
