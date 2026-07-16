'use client';
import { useState } from 'react';
import type { CVData } from '@/lib/cv-types';

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1v7.5M4.5 6L7 8.5 9.5 6M2 11.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Phase = 'idle' | 'confirm' | 'building' | 'done';

export function PDFExportButton({ data, variantName }: { data: CVData; variantName?: string }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const fileName = `${[data.personal.name || 'cv', variantName].filter(Boolean).join(' - ')}.pdf`;

  async function startDownload() {
    setPhase('building');
    try {
      setProgress(15);
      setStep('Loading PDF engine…');
      // Load the ~1.4MB PDF engine and build the document only when asked
      const [{ pdf }, { CVPDFDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./CVPDFDocument'),
      ]);
      setProgress(55);
      setStep('Building document…');
      const blob = await pdf(<CVPDFDocument data={data} />).toBlob();
      setProgress(90);
      setStep('Saving file…');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setProgress(100);
      setPhase('done');
      setTimeout(() => {
        setPhase('idle');
        setProgress(0);
      }, 1200);
    } catch {
      setPhase('idle');
      setProgress(0);
      alert('Could not build the PDF. Please try again.');
    }
  }

  function close() {
    if (phase === 'confirm') setPhase('idle');
  }

  return (
    <>
      <button
        onClick={() => setPhase('confirm')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none border border-violet-600 text-violet-700 bg-white hover:bg-violet-50 hover:border-violet-700"
        title={`Download ${fileName}`}
      >
        <DownloadIcon />
        Download PDF
      </button>

      {phase !== 'idle' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Download PDF"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={close}
          onKeyDown={e => e.key === 'Escape' && close()}
        >
          <div
            className="bg-white rounded-xl border border-zinc-200 shadow-xl w-full max-w-sm mx-4 p-6"
            onClick={e => e.stopPropagation()}
          >
            {phase === 'confirm' ? (
              <>
                <h3 className="font-semibold text-zinc-900 mb-1">Download PDF?</h3>
                <p className="text-sm text-zinc-500 mb-5">
                  This will generate and save{' '}
                  <span className="font-medium text-zinc-700 break-all">{fileName}</span>
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setPhase('idle')}
                    className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startDownload}
                    autoFocus
                    className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-zinc-900 mb-4">
                  {phase === 'done' ? 'Downloaded' : 'Preparing your PDF…'}
                </h3>
                <div className="h-2 rounded-full bg-zinc-100 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      phase === 'done' ? 'bg-emerald-500' : 'bg-violet-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400 break-all">
                  {phase === 'done' ? fileName : step}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
