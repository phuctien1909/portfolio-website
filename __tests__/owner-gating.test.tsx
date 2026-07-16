import { render, screen } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import CVPage from '../app/cv/page';
import EditPage from '../app/cv/edit/page';

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: replaceMock }),
}));

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
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });

beforeEach(() => {
  mockStorage.clear();
  replaceMock.mockClear();
  window.history.pushState({}, '', '/');
});

test('Navbar hides the Applications link for visitors', async () => {
  render(<Navbar />);
  expect(await screen.findByText('CV')).toBeInTheDocument();
  expect(screen.queryByText('Applications')).not.toBeInTheDocument();
});

test('Navbar shows the Applications link for the owner', async () => {
  mockStorage.setItem('portfolio_owner', '1');
  render(<Navbar />);
  expect(await screen.findByText('Applications')).toBeInTheDocument();
});

test('/cv hides owner controls for visitors but keeps Download PDF', async () => {
  render(<CVPage />);
  expect(await screen.findByText('Download PDF')).toBeInTheDocument();
  expect(screen.queryByText('Edit CV')).not.toBeInTheDocument();
  expect(screen.queryByText('Export JSON')).not.toBeInTheDocument();
  expect(screen.queryByText('Import JSON')).not.toBeInTheDocument();
  expect(screen.queryByText('Import PDF')).not.toBeInTheDocument();
});

test('/cv shows owner controls for the owner', async () => {
  mockStorage.setItem('portfolio_owner', '1');
  render(<CVPage />);
  expect(await screen.findByText('Edit CV')).toBeInTheDocument();
  expect(screen.getByText('Export JSON')).toBeInTheDocument();
});

test('/cv/edit redirects visitors to the home page', async () => {
  const { container } = render(<EditPage />);
  await new Promise(r => setTimeout(r, 0));
  expect(replaceMock).toHaveBeenCalledWith('/');
  expect(container).toBeEmptyDOMElement();
});

test('/cv/edit renders the editor for the owner', async () => {
  mockStorage.setItem('portfolio_owner', '1');
  render(<EditPage />);
  expect(await screen.findByText('Edit CV')).toBeInTheDocument();
  expect(replaceMock).not.toHaveBeenCalled();
});
