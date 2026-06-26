'use client';
import dynamic from 'next/dynamic';
import type { CVData } from '@/lib/cv-types';

// ponytail: dynamic imports required — @react-pdf/renderer uses browser canvas API, breaks SSR
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false }
);

const CVPDFDocument = dynamic(
  () => import('./CVPDFDocument').then(m => m.CVPDFDocument),
  { ssr: false }
);

export function PDFExportButton({ data }: { data: CVData }) {
  return (
    <PDFDownloadLink
      document={<CVPDFDocument data={data} />}
      fileName={`${data.personal.name || 'cv'}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Preparing PDF…' : 'Export PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
