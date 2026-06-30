'use client';
import { useRef, useState } from 'react';
import type { CVData } from '@/lib/cv-types';

type Status = 'idle' | 'dragging' | 'loading' | 'done' | 'error';

export function PDFImporter({ onImport }: { onImport: (data: Partial<CVData>) => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [preview, setPreview] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.name.endsWith('.pdf')) { setStatus('error'); return; }
    setStatus('loading');
    try {
      const { extractTextFromPDF, parseLinesToCV } = await import('@/lib/cv-pdf-parser');
      const lines = await extractTextFromPDF(file);
      const parsed = parseLinesToCV(lines);
      setPreview(lines.slice(0, 30));
      setStatus('done');
      onImport(parsed);
    } catch {
      setStatus('error');
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
    setStatus('idle');
  }

  const isActive = status === 'dragging';

  return (
    <div>
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleInput} className="hidden" />

      <div
        onClick={() => status === 'loading' || inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setStatus('dragging'); }}
        onDragLeave={() => setStatus('idle')}
        onDrop={handleDrop}
        className={`
          relative rounded-xl border-2 border-dashed px-6 py-10 text-center
          transition-colors cursor-pointer select-none
          ${isActive
            ? 'border-violet-500 bg-violet-50'
            : status === 'done'
            ? 'border-emerald-300 bg-emerald-50 cursor-default'
            : status === 'error'
            ? 'border-red-300 bg-red-50 cursor-default'
            : 'border-zinc-300 bg-zinc-50 hover:border-violet-400 hover:bg-violet-50'
          }
        `}
      >
        {status === 'idle' || status === 'dragging' ? (
          <>
            <svg className={`mx-auto mb-3 h-8 w-8 ${isActive ? 'text-violet-500' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className={`text-sm font-medium ${isActive ? 'text-violet-700' : 'text-zinc-700'}`}>
              {isActive ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
            </p>
            <p className="mt-1 text-xs text-zinc-400">PDF files only</p>
          </>
        ) : status === 'loading' ? (
          <>
            <svg className="mx-auto mb-3 h-8 w-8 text-violet-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium text-violet-700">Extracting text…</p>
          </>
        ) : status === 'done' ? (
          <>
            <svg className="mx-auto mb-3 h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-sm font-medium text-emerald-700">Pre-filled from PDF — review in the editor</p>
            <button
              onClick={e => { e.stopPropagation(); setStatus('idle'); }}
              className="mt-2 text-xs text-zinc-400 hover:text-zinc-600 underline"
            >
              Upload another
            </button>
            {preview.length > 0 && (
              <details className="mt-3 text-left" onClick={e => e.stopPropagation()}>
                <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600">Show extracted text</summary>
                <pre className="text-xs text-zinc-400 overflow-x-auto mt-1 p-2 bg-white rounded border border-zinc-200 max-h-40">
                  {preview.join('\n')}
                </pre>
              </details>
            )}
          </>
        ) : (
          <>
            <svg className="mx-auto mb-3 h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p className="text-sm font-medium text-red-600">Failed to read the PDF</p>
            <button
              onClick={e => { e.stopPropagation(); setStatus('idle'); }}
              className="mt-2 text-xs text-zinc-400 hover:text-zinc-600 underline"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
