'use client';
import { useState } from 'react';
import type { CVData } from '@/lib/cv-types';

type Status = 'idle' | 'loading' | 'done' | 'error';

export function PDFImporter({ onImport }: { onImport: (data: Partial<CVData>) => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [preview, setPreview] = useState<string[]>([]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-yellow-50">
      <p className="text-sm font-medium mb-1">Import from PDF</p>
      <p className="text-xs text-gray-500 mb-3">
        Text is extracted and pre-filled as a best effort. Always review the results in the editor.
      </p>
      <input type="file" accept=".pdf" onChange={handleFile} className="text-sm" />
      {status === 'loading' && <p className="text-sm text-blue-600 mt-2">Extracting text...</p>}
      {status === 'error' && (
        <p className="text-sm text-red-500 mt-2">Failed to read the PDF. Try a different file.</p>
      )}
      {status === 'done' && (
        <div className="mt-3">
          <p className="text-xs text-green-600 font-medium">Pre-filled from PDF — please review in the editor</p>
          <details className="mt-1">
            <summary className="text-xs text-gray-400 cursor-pointer">Show extracted text</summary>
            <pre className="text-xs text-gray-400 overflow-x-auto mt-1 p-2 bg-white rounded border max-h-40">
              {preview.join('\n')}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
