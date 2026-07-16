import { render, screen } from '@testing-library/react';
import { PDFExportButton } from '../components/cv/PDFExportButton';
import { defaultCV } from '../lib/cv-defaults';

test('renders a ready Download PDF button immediately, without building the PDF', () => {
  render(<PDFExportButton data={defaultCV} variantName="Master" />);
  const btn = screen.getByText('Download PDF');
  expect(btn).toBeInTheDocument();
  expect(btn).not.toBeDisabled();
});
