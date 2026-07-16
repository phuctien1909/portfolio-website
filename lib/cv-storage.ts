import type { CVData, CVVariant, JobApplication } from './cv-types';
import { defaultCV } from './cv-defaults';

const CV_KEY = 'portfolio_cv'; // legacy single-CV key, migration source only
const CV_DEFAULT_KEY = 'portfolio_cv_default';
const LIBRARY_KEY = 'portfolio_cv_library';
const ACTIVE_KEY = 'portfolio_cv_active';
const APPS_KEY = 'portfolio_applications';

function parse(raw: string | null): CVData | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw);
    return { ...defaultCV, ...stored, personal: { ...defaultCV.personal, ...(stored.personal ?? {}) } };
  } catch {
    return null;
  }
}

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function writeLibrary(lib: CVVariant[]): void {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      alert('Save failed: storage quota exceeded. Remove the portrait photo to reduce data size, then try again.');
    } else {
      throw e;
    }
  }
}

function migrate(): CVVariant[] {
  const legacy = parse(localStorage.getItem(CV_KEY)) ?? parse(localStorage.getItem(CV_DEFAULT_KEY)) ?? defaultCV;
  const master: CVVariant = { id: newId(), name: 'Master', updatedAt: new Date().toISOString(), data: legacy };
  writeLibrary([master]);
  localStorage.setItem(ACTIVE_KEY, master.id);
  return [master];
}

export function loadLibrary(): CVVariant[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(LIBRARY_KEY);
  if (!raw) return migrate();
  try {
    const lib = JSON.parse(raw) as CVVariant[];
    if (!Array.isArray(lib) || lib.length === 0) return migrate();
    // deep-merge each variant's data with defaults so old exports gain new fields
    return lib.map(v => ({
      ...v,
      data: { ...defaultCV, ...v.data, personal: { ...defaultCV.personal, ...(v.data?.personal ?? {}) } },
    }));
  } catch {
    return migrate();
  }
}

export function getActiveVariant(): CVVariant {
  if (typeof window === 'undefined') {
    return { id: '', name: 'Master', updatedAt: '', data: defaultCV };
  }
  const lib = loadLibrary();
  const id = localStorage.getItem(ACTIVE_KEY);
  return lib.find(v => v.id === id) ?? lib[0];
}

export function setActiveVariant(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function createVariant(name: string, data: CVData): CVVariant {
  const lib = loadLibrary();
  const v: CVVariant = { id: newId(), name, updatedAt: new Date().toISOString(), data };
  writeLibrary([...lib, v]);
  setActiveVariant(v.id);
  return v;
}

export function duplicateVariant(id: string, name: string): CVVariant | null {
  const src = loadLibrary().find(v => v.id === id);
  if (!src) return null;
  return createVariant(name, src.data);
}

export function renameVariant(id: string, name: string): void {
  writeLibrary(loadLibrary().map(v => (v.id === id ? { ...v, name, updatedAt: new Date().toISOString() } : v)));
}

export function deleteVariant(id: string): void {
  const lib = loadLibrary();
  if (lib.length <= 1) return; // never delete the last variant
  const remaining = lib.filter(v => v.id !== id);
  if (remaining.length === lib.length) return; // unknown id
  writeLibrary(remaining);
  if (localStorage.getItem(ACTIVE_KEY) === id) setActiveVariant(remaining[0].id);
  const apps = loadApplications().map(a => (a.cvId === id ? { ...a, cvId: null } : a));
  writeApplications(apps);
}

export function loadCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  return getActiveVariant().data;
}

export function loadDefaultCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  return parse(localStorage.getItem(CV_DEFAULT_KEY)) ?? defaultCV;
}

export function saveCV(data: CVData): void {
  if (typeof window === 'undefined') return;
  const active = getActiveVariant();
  writeLibrary(
    loadLibrary().map(v => (v.id === active.id ? { ...v, data, updatedAt: new Date().toISOString() } : v))
  );
  // keep the "New variant" seed fresh (personal info carries over); ignore quota here —
  // the library write above already alerted if storage is full
  try {
    localStorage.setItem(CV_DEFAULT_KEY, JSON.stringify(data));
  } catch {
    /* noop */
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

export function loadApplications(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(APPS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeApplications(apps: JobApplication[]): void {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function saveApplication(app: JobApplication): void {
  if (typeof window === 'undefined') return;
  const apps = loadApplications();
  const stamped = { ...app, updatedAt: new Date().toISOString() };
  const exists = apps.some(a => a.id === app.id);
  writeApplications(exists ? apps.map(a => (a.id === app.id ? stamped : a)) : [...apps, stamped]);
}

export function deleteApplication(id: string): void {
  if (typeof window === 'undefined') return;
  writeApplications(loadApplications().filter(a => a.id !== id));
}

export function applicationsUsingVariant(cvId: string): JobApplication[] {
  return loadApplications().filter(a => a.cvId === cvId);
}

export function loadPortfolioCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  const lib = loadLibrary();
  return (lib.find(v => v.name === 'Master') ?? lib[0]).data;
}

const OWNER_KEY = 'portfolio_owner';

export function isOwner(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(OWNER_KEY) === '1';
}

export function applyOwnerParam(): boolean {
  if (typeof window === 'undefined') return false;
  const param = new URLSearchParams(window.location.search).get('owner');
  if (param === 'on') localStorage.setItem(OWNER_KEY, '1');
  if (param === 'off') localStorage.removeItem(OWNER_KEY);
  return isOwner();
}

export function newApplication(): JobApplication {
  const now = new Date();
  return {
    id: newId(),
    company: '',
    role: '',
    url: '',
    appliedDate: now.toISOString().slice(0, 10),
    status: 'draft',
    notes: '',
    cvId: null,
    updatedAt: now.toISOString(),
  };
}
