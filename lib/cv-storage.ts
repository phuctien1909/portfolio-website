import type { CVData } from './cv-types';
import { defaultCV } from './cv-defaults';

const CV_KEY = 'portfolio_cv';
const CV_DEFAULT_KEY = 'portfolio_cv_default';

function parse(raw: string | null): CVData | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw);
    return { ...defaultCV, ...stored, personal: { ...defaultCV.personal, ...(stored.personal ?? {}) } };
  } catch {
    return null;
  }
}

export function loadCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  // Seed cv-default from existing saved data on first run
  if (!localStorage.getItem(CV_DEFAULT_KEY)) {
    const existing = localStorage.getItem(CV_KEY);
    if (existing) localStorage.setItem(CV_DEFAULT_KEY, existing);
  }
  return parse(localStorage.getItem(CV_KEY))
    ?? parse(localStorage.getItem(CV_DEFAULT_KEY))
    ?? defaultCV;
}

export function loadDefaultCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  return parse(localStorage.getItem(CV_DEFAULT_KEY)) ?? defaultCV;
}

export function saveCV(data: CVData): void {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(data);
  try {
    localStorage.setItem(CV_KEY, json);
    localStorage.setItem(CV_DEFAULT_KEY, json);
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
