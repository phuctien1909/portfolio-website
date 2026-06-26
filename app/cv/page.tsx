'use client';
import dynamic from 'next/dynamic';
import { CVPreview } from '@/components/cv/CVPreview';
import { defaultCV } from '@/lib/cv-defaults';

const PDFExportButton = dynamic(
  () => import('@/components/cv/PDFExportButton').then(m => m.PDFExportButton),
  { ssr: false }
);

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
