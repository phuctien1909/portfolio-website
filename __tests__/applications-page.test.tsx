import { render, screen } from '@testing-library/react';
import ApplicationsPage from '../app/applications/page';
import { saveApplication, newApplication } from '../lib/cv-storage';

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: replaceMock }),
}));

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
  replaceMock.mockClear();
  window.history.pushState({}, '', '/applications');
});

test('renders empty state with New application button for the owner', async () => {
  mockStorage.setItem('portfolio_owner', '1');
  render(<ApplicationsPage />);
  expect(await screen.findByText('New application')).toBeInTheDocument();
  expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
});

test('renders stored applications for the owner', async () => {
  mockStorage.setItem('portfolio_owner', '1');
  saveApplication({ ...newApplication(), company: 'Acme Corp', role: 'QA Engineer', status: 'applied' });
  render(<ApplicationsPage />);
  expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
  expect(screen.getByText('QA Engineer')).toBeInTheDocument();
});

test('redirects non-owners to the home page', async () => {
  const { container } = render(<ApplicationsPage />);
  await new Promise(r => setTimeout(r, 0)); // let the mount effect run
  expect(replaceMock).toHaveBeenCalledWith('/');
  expect(container).toBeEmptyDOMElement();
});
