'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { CVData, CVVariant } from '@/lib/cv-types';
import { getActiveVariant, createVariant, saveCV, exportJSON, importJSON } from '@/lib/cv-storage';
import { CVPreview } from '@/components/cv/CVPreview';
import { PDFImporter } from '@/components/cv/PDFImporter';
import { PDFExportButton } from '@/components/cv/PDFExportButton';

export default function CVPage() {
  const [variant, setVariant] = useState<CVVariant | null>(null);
  const [showPDFImporter, setShowPDFImporter] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setVariant(getActiveVariant()); }, []);

  function handleJSONImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(file)
      .then(data => {
        const name = file.name.replace(/\.json$/i, '') || 'Imported';
        createVariant(name, data); // becomes the active variant
        setVariant(getActiveVariant());
      })
      .catch(() => alert('Could not parse the JSON file.'));
    e.target.value = '';
  }

  function handlePDFImport(partial: Partial<CVData>) {
    setVariant(prev => {
      if (!prev) return prev;
      const merged = {
        ...prev.data,
        ...partial,
        personal: { ...prev.data.personal, ...(partial.personal ?? {}) },
      };
      saveCV(merged);
      return getActiveVariant();
    });
    setShowPDFImporter(false);
  }

  if (!variant) return null;
  const cv = variant.data;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 mb-8 items-center">
        <Link
          href="/cv/edit"
          className="px-4 py-2 bg-violet-700 text-white rounded-lg text-sm hover:bg-violet-600 transition-colors font-medium"
        >
          Edit CV
        </Link>
        <PDFExportButton data={cv} variantName={variant.name} />
        <div className="w-px h-5 bg-zinc-300 mx-1" />
        <button
          onClick={() => exportJSON(cv)}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Export JSON
        </button>
        <button
          onClick={() => jsonInputRef.current?.click()}
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Import JSON
        </button>
        <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={handleJSONImport} />
        <button
          onClick={() => setShowPDFImporter(v => !v)}
          className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
            showPDFImporter
              ? 'bg-violet-50 border-violet-400 text-violet-700'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
          }`}
        >
          Import PDF
        </button>
        <span className="ml-auto text-sm text-zinc-400">Variant: {variant.name}</span>
      </div>

      {showPDFImporter && (
        <div className="mb-8">
          <PDFImporter onImport={handlePDFImport} />
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <CVPreview data={cv} />
      </div>
    </main>
  );
}
