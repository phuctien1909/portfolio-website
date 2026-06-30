'use client';
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVPDFDocument } from './CVPDFDocument';
import type { CVData } from '@/lib/cv-types';

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1v7.5M4.5 6L7 8.5 9.5 6M2 11.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type State = 'idle' | 'downloading' | 'done';

export function PDFExportButton({ data }: { data: CVData }) {
  const [state, setState] = useState<State>('idle');
  const fileName = `${data.personal.name || 'cv'}.pdf`;

  function handleClick() {
    setState('downloading');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 2200);
    }, 1200);
  }

  return (
    <PDFDownloadLink
      document={<CVPDFDocument data={data} />}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => {
        const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none';

        if (loading) {
          return (
            <button disabled className={`${base} pdf-btn-loading text-white cursor-wait`} title="Preparing your PDF…">
              <span className="pdf-spin inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white shrink-0" />
              Building PDF…
            </button>
          );
        }

        if (state === 'downloading') {
          return (
            <button disabled className={`${base} border border-violet-400 text-violet-500 bg-violet-50 cursor-wait`} title="Starting download…">
              <span className="pdf-spin inline-block w-3.5 h-3.5 rounded-full border-2 border-violet-300 border-t-violet-600 shrink-0" />
              Downloading…
            </button>
          );
        }

        if (state === 'done') {
          return (
            <button className={`${base} bg-emerald-600 text-white border border-emerald-600`} title={`${fileName} downloaded`}>
              <CheckIcon />
              Downloaded
            </button>
          );
        }

        return (
          <button
            onClick={handleClick}
            className={`${base} border border-violet-600 text-violet-700 bg-white hover:bg-violet-50 hover:border-violet-700`}
            title={`Download ${fileName}`}
          >
            <DownloadIcon />
            Download PDF
          </button>
        );
      }}
    </PDFDownloadLink>
  );
}
