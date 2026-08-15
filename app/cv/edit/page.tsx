'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ParsedCV } from '@/lib/cv-types';
import { applyOwnerParam } from '@/lib/cv-storage';
import { CVEditor } from '@/components/cv/editor/CVEditor';
import { PDFImporter } from '@/components/cv/PDFImporter';

export default function EditPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [pdfImport, setPDFImport] = useState<ParsedCV | undefined>();
  const [showImporter, setShowImporter] = useState(false);

  useEffect(() => {
    if (applyOwnerParam()) setAllowed(true);
    else router.replace('/');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allowed) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit CV</h1>
        <button
          onClick={() => setShowImporter(v => !v)}
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded"
        >
          Import from PDF
        </button>
      </div>
      {showImporter && (
        <div className="mb-6">
          <PDFImporter
            onImport={data => {
              setPDFImport(data);
              setShowImporter(false);
            }}
          />
        </div>
      )}
      <CVEditor initialData={pdfImport} key={JSON.stringify(pdfImport)} />
    </main>
  );
}
