import { isOwner, applyOwnerParam } from '../lib/cv-storage';

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });

beforeEach(() => {
  mockStorage.clear();
  window.history.pushState({}, '', '/');
});

test('isOwner is false by default', () => {
  expect(isOwner()).toBe(false);
});

test('?owner=on sets the flag', () => {
  window.history.pushState({}, '', '/?owner=on');
  expect(applyOwnerParam()).toBe(true);
  expect(isOwner()).toBe(true);
});

test('?owner=off clears the flag', () => {
  mockStorage.setItem('portfolio_owner', '1');
  window.history.pushState({}, '', '/cv?owner=off');
  expect(applyOwnerParam()).toBe(false);
  expect(isOwner()).toBe(false);
});

test('no parameter leaves the flag unchanged', () => {
  mockStorage.setItem('portfolio_owner', '1');
  window.history.pushState({}, '', '/applications');
  expect(applyOwnerParam()).toBe(true);
});

test('unknown parameter value changes nothing', () => {
  window.history.pushState({}, '', '/?owner=maybe');
  expect(applyOwnerParam()).toBe(false);
});
