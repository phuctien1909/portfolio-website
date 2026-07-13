import {
  loadApplications,
  saveApplication,
  deleteApplication,
  applicationsUsingVariant,
  newApplication,
  loadLibrary,
  createVariant,
  deleteVariant,
} from '../lib/cv-storage';
import { defaultCV } from '../lib/cv-defaults';
import type { JobApplication } from '../lib/cv-types';

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

function makeApp(overrides: Partial<JobApplication> = {}): JobApplication {
  return { ...newApplication(), company: 'Acme', role: 'QA', ...overrides };
}

test('loadApplications returns [] when nothing stored', () => {
  expect(loadApplications()).toEqual([]);
});

test('loadApplications returns [] on corrupt JSON', () => {
  mockStorage.setItem('portfolio_applications', '{bad');
  expect(loadApplications()).toEqual([]);
});

test('saveApplication inserts then updates by id', () => {
  const app = makeApp();
  saveApplication(app);
  expect(loadApplications()).toHaveLength(1);
  saveApplication({ ...app, status: 'interview' });
  const stored = loadApplications();
  expect(stored).toHaveLength(1);
  expect(stored[0].status).toBe('interview');
});

test('deleteApplication removes by id', () => {
  const app = makeApp();
  saveApplication(app);
  deleteApplication(app.id);
  expect(loadApplications()).toEqual([]);
});

test('applicationsUsingVariant filters by cvId', () => {
  const v = createVariant('Backend', defaultCV);
  saveApplication(makeApp({ cvId: v.id }));
  saveApplication(makeApp({ id: 'other', cvId: null }));
  expect(applicationsUsingVariant(v.id)).toHaveLength(1);
});

test('deleteVariant nulls cvId on referencing applications', () => {
  loadLibrary(); // seeds Master so v is not the last variant
  const v = createVariant('Backend', defaultCV);
  const app = makeApp({ cvId: v.id });
  saveApplication(app);
  deleteVariant(v.id);
  expect(loadApplications()[0].cvId).toBeNull();
});

test('newApplication defaults to a draft dated today', () => {
  const app = newApplication();
  expect(app.status).toBe('draft');
  expect(app.appliedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(app.cvId).toBeNull();
});
