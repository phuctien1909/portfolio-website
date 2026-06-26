'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVPDFDocument } from './CVPDFDocument';
import type { CVData } from '@/lib/cv-types';

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
