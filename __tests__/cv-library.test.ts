import {
  loadLibrary,
  getActiveVariant,
  setActiveVariant,
  createVariant,
  duplicateVariant,
  renameVariant,
  deleteVariant,
  loadCV,
  saveCV,
} from '../lib/cv-storage';
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

beforeEach(() => mockStorage.clear());

test('first loadLibrary migrates legacy portfolio_cv into a Master variant', () => {
  mockStorage.setItem('portfolio_cv', JSON.stringify({ ...defaultCV, summary: 'Legacy' }));
  const lib = loadLibrary();
  expect(lib).toHaveLength(1);
  expect(lib[0].name).toBe('Master');
  expect(lib[0].data.summary).toBe('Legacy');
  expect(getActiveVariant().id).toBe(lib[0].id);
});

test('loadLibrary with nothing stored creates a Master variant from defaults', () => {
  const lib = loadLibrary();
  expect(lib).toHaveLength(1);
  expect(lib[0].data).toEqual(defaultCV);
});

test('loadLibrary re-migrates when library JSON is corrupt', () => {
  mockStorage.setItem('portfolio_cv_library', '{bad json');
  const lib = loadLibrary();
  expect(lib).toHaveLength(1);
  expect(lib[0].name).toBe('Master');
});

test('createVariant appends and becomes active', () => {
  loadLibrary(); // seeds Master
  const v = createVariant('Backend JP', { ...defaultCV, summary: 'Backend' });
  const lib = loadLibrary();
  expect(lib).toHaveLength(2);
  expect(getActiveVariant().id).toBe(v.id);
  expect(getActiveVariant().data.summary).toBe('Backend');
});

test('duplicateVariant copies data under a new id and name', () => {
  const master = loadLibrary()[0];
  const copy = duplicateVariant(master.id, 'Master (copy)');
  expect(copy).not.toBeNull();
  expect(copy!.id).not.toBe(master.id);
  expect(copy!.name).toBe('Master (copy)');
  expect(copy!.data).toEqual(master.data);
  expect(loadLibrary()).toHaveLength(2);
});

test('duplicateVariant returns null for unknown id', () => {
  loadLibrary();
  expect(duplicateVariant('nope', 'x')).toBeNull();
});

test('renameVariant renames in place', () => {
  const master = loadLibrary()[0];
  renameVariant(master.id, 'Primary');
  expect(loadLibrary()[0].name).toBe('Primary');
});

test('deleteVariant removes and repairs the active pointer', () => {
  const master = loadLibrary()[0];
  const b = createVariant('B', defaultCV); // active = b
  deleteVariant(b.id);
  const lib = loadLibrary();
  expect(lib).toHaveLength(1);
  expect(getActiveVariant().id).toBe(master.id);
});

test('deleteVariant refuses to delete the last variant', () => {
  const master = loadLibrary()[0];
  deleteVariant(master.id);
  expect(loadLibrary()).toHaveLength(1);
});

test('loadCV/saveCV operate on the active variant only', () => {
  const master = loadLibrary()[0];
  const b = createVariant('B', defaultCV); // active = b
  saveCV({ ...defaultCV, summary: 'B summary' });
  expect(loadCV().summary).toBe('B summary');
  setActiveVariant(master.id);
  expect(loadCV().summary).toBe(defaultCV.summary);
  expect(loadLibrary().find(v => v.id === b.id)!.data.summary).toBe('B summary');
});

test('getActiveVariant falls back to first variant when pointer is stale', () => {
  const master = loadLibrary()[0];
  setActiveVariant('deleted-id');
  expect(getActiveVariant().id).toBe(master.id);
});
