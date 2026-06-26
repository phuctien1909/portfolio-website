import type { CVData } from './cv-types';
import { defaultCV } from './cv-defaults';

const CV_KEY = 'portfolio_cv';

export function loadCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  try {
    const raw = localStorage.getItem(CV_KEY);
    if (!raw) return defaultCV;
    const stored = JSON.parse(raw);
    return {
      ...defaultCV,
      ...stored,
      personal: { ...defaultCV.personal, ...(stored.personal ?? {}) },
    };
  } catch {
    return defaultCV;
  }
}

export function saveCV(data: CVData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CV_KEY, JSON.stringify(data));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('Save failed: storage quota exceeded. Remove the portrait photo to reduce data size, then try again.');
    } else {
      throw e;
    }
  }
}

export function exportJSON(data: CVData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personal.name || 'cv'}-data.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export async function importJSON(file: File): Promise<CVData> {
  const text = await file.text();
  const parsed = JSON.parse(text); // throws on bad JSON
  return { ...defaultCV, ...parsed };
}
