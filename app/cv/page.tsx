'use client';
import { CVPreview } from '@/components/cv/CVPreview';
import { PDFExportButton } from '@/components/cv/PDFExportButton';
import { defaultCV } from '@/lib/cv-defaults';

const testCV = {
  ...defaultCV,
  personal: { ...defaultCV.personal, name: 'Test User', title: 'Developer', email: 'test@example.com' },
  summary: 'A test summary.',
  skills: ['TypeScript', 'React', 'Next.js'],
};

export default function CVPage() {
  return (
    <main className="p-8">
      <PDFExportButton data={testCV} />
      <CVPreview data={testCV} />
    </main>
  );
}
