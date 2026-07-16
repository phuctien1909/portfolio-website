import { render, screen, fireEvent } from '@testing-library/react';
import { PDFExportButton } from '../components/cv/PDFExportButton';
import { defaultCV } from '../lib/cv-defaults';

test('renders a ready Download PDF button immediately, without building the PDF', () => {
  render(<PDFExportButton data={defaultCV} variantName="Master" />);
  const btn = screen.getByText('Download PDF');
  expect(btn).toBeInTheDocument();
  expect(btn).not.toBeDisabled();
});

test('clicking the button opens a confirmation dialog naming the file', () => {
  render(<PDFExportButton data={defaultCV} variantName="Master" />);
  fireEvent.click(screen.getByText('Download PDF'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Download PDF?')).toBeInTheDocument();
  expect(screen.getByText(`${defaultCV.personal.name} - Master.pdf`)).toBeInTheDocument();
});

test('Cancel closes the dialog without downloading', () => {
  render(<PDFExportButton data={defaultCV} variantName="Master" />);
  fireEvent.click(screen.getByText('Download PDF'));
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
