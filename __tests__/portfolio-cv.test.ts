import {
  loadPortfolioCV,
  loadLibrary,
  createVariant,
  renameVariant,
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

test('returns default data when nothing is stored', () => {
  expect(loadPortfolioCV()).toEqual(defaultCV);
});

test('returns the Master variant even when another variant is active', () => {
  loadLibrary(); // seeds Master (data = defaultCV)
  createVariant('Backend', { ...defaultCV, summary: 'tailored for one job' }); // becomes active
  expect(loadPortfolioCV().summary).toBe(defaultCV.summary);
});

test('falls back to the first variant when none is named Master', () => {
  const master = loadLibrary()[0];
  renameVariant(master.id, 'Primary');
  expect(loadPortfolioCV()).toEqual(defaultCV); // first variant's data
});
