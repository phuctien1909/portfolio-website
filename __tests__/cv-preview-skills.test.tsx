import { render, screen } from '@testing-library/react';
import { CVPreview } from '../components/cv/CVPreview';
import { defaultCV } from '../lib/cv-defaults';
import type { CVData } from '../lib/cv-types';

const data: CVData = {
  ...defaultCV,
  skills: [
    { id: 'g1', category: 'Languages', items: ['Java', 'Python'] },
    { id: 'g2', category: 'Databases', items: ['SQL'] },
  ],
};

test('CV preview renders each skill category label and its items', () => {
  render(<CVPreview data={data} />);
  expect(screen.getByText('Languages')).toBeInTheDocument();
  expect(screen.getByText('Databases')).toBeInTheDocument();
  expect(screen.getByText('Java')).toBeInTheDocument();
  expect(screen.getByText('Python')).toBeInTheDocument();
  expect(screen.getByText('SQL')).toBeInTheDocument();
});
