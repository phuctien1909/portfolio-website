import { render, screen } from '@testing-library/react';
import ApplicationsPage from '../app/applications/page';
import { saveApplication, newApplication } from '../lib/cv-storage';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

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

test('renders empty state with New application button', async () => {
  render(<ApplicationsPage />);
  expect(await screen.findByText('New application')).toBeInTheDocument();
  expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
});

test('renders stored applications', async () => {
  saveApplication({ ...newApplication(), company: 'Acme Corp', role: 'QA Engineer', status: 'applied' });
  render(<ApplicationsPage />);
  expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
  expect(screen.getByText('QA Engineer')).toBeInTheDocument();
});
