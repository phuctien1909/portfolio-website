import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { defaultCV } from '../lib/cv-defaults';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
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

test('renders name, first project, and email button from default CV', async () => {
  render(<Home />);
  expect(await screen.findByText(defaultCV.personal.name)).toBeInTheDocument();
  expect(screen.getByText(defaultCV.projects[0].name)).toBeInTheDocument();
  expect(screen.getByText('Email Me')).toHaveAttribute('href', `mailto:${defaultCV.personal.email}`);
});

test('renders the stored Master variant data', async () => {
  mockStorage.setItem('portfolio_cv_library', JSON.stringify([
    {
      id: 'm',
      name: 'Master',
      updatedAt: '',
      data: { ...defaultCV, personal: { ...defaultCV.personal, name: 'Jane Zzz' } },
    },
  ]));
  render(<Home />);
  expect(await screen.findByText('Jane Zzz')).toBeInTheDocument();
});
