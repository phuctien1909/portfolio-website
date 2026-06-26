# Portfolio Website with CV Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal portfolio website with a full CV editor that exports to PDF and imports from both JSON backup files and existing PDF resumes.

**Architecture:** Next.js 14 App Router with client-side-only data persistence via localStorage. The CV editor writes to localStorage; the `/cv` page reads from it and exposes export/import controls. PDF export uses `@react-pdf/renderer` as a dynamic client component; PDF import uses `pdfjs-dist` to extract text and heuristically pre-populate the editor. No backend required.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, `@react-pdf/renderer` (PDF export), `pdfjs-dist` (PDF text extraction), Jest + React Testing Library (unit tests).

## Global Constraints

- Node.js 18+
- Next.js 14+ App Router (not Pages Router)
- TypeScript strict mode
- Tailwind CSS for all styling — no inline styles, no CSS modules
- `@react-pdf/renderer` and `pdfjs-dist` **must** use `dynamic(..., { ssr: false })` — both use browser/Node APIs incompatible with SSR
- All CV data stored under the key `"portfolio_cv"` in localStorage
- PDF text import is best-effort heuristic; UI must communicate this clearly to the user
- `crypto.randomUUID()` used for list-item IDs (available in all modern browsers and Node 18+)

---

## File Map

| Path | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root HTML shell, Navbar, global fonts |
| `app/page.tsx` | Portfolio landing page (Hero, About, Projects, Contact) |
| `app/cv/page.tsx` | Public CV view + PDF/JSON export + PDF/JSON import buttons |
| `app/cv/edit/page.tsx` | CV editor page |
| `components/Navbar.tsx` | Site-wide top navigation |
| `components/portfolio/Hero.tsx` | Hero section (name, title, tagline, CTA) |
| `components/portfolio/About.tsx` | About me section |
| `components/portfolio/ProjectsSection.tsx` | Projects showcase cards |
| `components/portfolio/Contact.tsx` | Contact section with links |
| `components/cv/CVPreview.tsx` | Read-only HTML rendering of the full CV |
| `components/cv/CVPDFDocument.tsx` | `@react-pdf/renderer` PDF template |
| `components/cv/PDFExportButton.tsx` | Dynamic-imported `PDFDownloadLink` wrapper |
| `components/cv/PDFImporter.tsx` | PDF upload UI + triggers text extraction |
| `components/cv/editor/CVEditor.tsx` | Editor root: state, localStorage sync, section tabs, live preview |
| `components/cv/editor/PersonalInfoForm.tsx` | Name, title, contact fields |
| `components/cv/editor/SummaryForm.tsx` | Summary/objective textarea |
| `components/cv/editor/ExperienceForm.tsx` | Work experience list — add/remove entries + bullet points |
| `components/cv/editor/EducationForm.tsx` | Education list — add/remove entries |
| `components/cv/editor/SkillsForm.tsx` | Skills tag input |
| `components/cv/editor/ProjectsForm.tsx` | Projects list — add/remove entries |
| `lib/cv-types.ts` | TypeScript interfaces for all CV data |
| `lib/cv-defaults.ts` | Empty default CV object |
| `lib/cv-storage.ts` | localStorage read/write + JSON export/import |
| `lib/cv-pdf-parser.ts` | `pdfjs-dist` text extraction + heuristic section parser |
| `__tests__/cv-storage.test.ts` | Unit tests for storage utilities |
| `__tests__/cv-pdf-parser.test.ts` | Unit tests for heuristic parser |

---

## Task 1: Project Initialization

**Files:**
- Create: project root (via `create-next-app`)
- Modify: `tailwind.config.ts` (content paths)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `components/Navbar.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: runnable Next.js dev server at `http://localhost:3000`, `npm test` passes with zero tests

- [ ] **Step 1: Scaffold Next.js project**

Run from the parent directory (`D:\Git projects`):
```bash
npx create-next-app@latest portfolio-website \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint
```

Expected output: `Success! Created portfolio-website`

- [ ] **Step 2: Install runtime dependencies**

```bash
cd portfolio-website
npm install @react-pdf/renderer pdfjs-dist
```

Expected: no peer-dep errors.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest
```

- [ ] **Step 4: Create jest config**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Create folder structure**

```bash
mkdir -p components/portfolio components/cv/editor lib __tests__
```

- [ ] **Step 6: Create Navbar**

Create `components/Navbar.tsx`:
```tsx
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
      <Link href="/" className="font-bold text-lg">Portfolio</Link>
      <div className="flex gap-6 text-sm">
        <Link href="/#about" className="hover:text-blue-600">About</Link>
        <Link href="/#projects" className="hover:text-blue-600">Projects</Link>
        <Link href="/#contact" className="hover:text-blue-600">Contact</Link>
        <Link href="/cv" className="hover:text-blue-600 font-medium">CV</Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 7: Update root layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio and CV',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: server at `http://localhost:3000`, no compile errors.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Tailwind and test setup"
```

---

## Task 2: CV Types, Storage, and Defaults

**Files:**
- Create: `lib/cv-types.ts`
- Create: `lib/cv-defaults.ts`
- Create: `lib/cv-storage.ts`
- Create: `__tests__/cv-storage.test.ts`

**Interfaces:**
- Produces: `CVData` type, `loadCV()`, `saveCV()`, `exportJSON()`, `importJSON()` — used by all CV components

- [ ] **Step 1: Write the failing tests**

Create `__tests__/cv-storage.test.ts`:
```typescript
import { loadCV, saveCV, importJSON } from '../lib/cv-storage';
import { defaultCV } from '../lib/cv-defaults';

const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });

beforeEach(() => mockStorage.clear());

test('loadCV returns defaultCV when nothing is stored', () => {
  expect(loadCV()).toEqual(defaultCV);
});

test('saveCV + loadCV round-trips data', () => {
  const cv = { ...defaultCV, summary: 'Test summary' };
  saveCV(cv);
  expect(loadCV().summary).toBe('Test summary');
});

test('loadCV handles corrupted localStorage gracefully', () => {
  mockStorage.setItem('portfolio_cv', '{bad json');
  expect(loadCV()).toEqual(defaultCV);
});

test('importJSON parses a valid JSON file', async () => {
  const data = { ...defaultCV, summary: 'Imported' };
  const file = new File([JSON.stringify(data)], 'cv.json', { type: 'application/json' });
  const result = await importJSON(file);
  expect(result.summary).toBe('Imported');
});

test('importJSON rejects invalid JSON', async () => {
  const file = new File(['not json'], 'cv.json', { type: 'application/json' });
  await expect(importJSON(file)).rejects.toThrow();
});

test('importJSON merges with defaults (missing fields filled in)', async () => {
  const partial = { summary: 'Only summary' };
  const file = new File([JSON.stringify(partial)], 'cv.json', { type: 'application/json' });
  const result = await importJSON(file);
  expect(result.personal).toEqual(defaultCV.personal);
  expect(result.summary).toBe('Only summary');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx jest __tests__/cv-storage.test.ts
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create CV types**

Create `lib/cv-types.ts`:
```typescript
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}
```

- [ ] **Step 4: Create defaults**

Create `lib/cv-defaults.ts`:
```typescript
import type { CVData } from './cv-types';

export const defaultCV: CVData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};
```

- [ ] **Step 5: Create storage utilities**

Create `lib/cv-storage.ts`:
```typescript
import type { CVData } from './cv-types';
import { defaultCV } from './cv-defaults';

const CV_KEY = 'portfolio_cv';

export function loadCV(): CVData {
  if (typeof window === 'undefined') return defaultCV;
  try {
    const raw = localStorage.getItem(CV_KEY);
    return raw ? { ...defaultCV, ...JSON.parse(raw) } : defaultCV;
  } catch {
    return defaultCV;
  }
}

export function saveCV(data: CVData): void {
  localStorage.setItem(CV_KEY, JSON.stringify(data));
}

export function exportJSON(data: CVData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personal.name || 'cv'}-data.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJSON(file: File): Promise<CVData> {
  const text = await file.text();
  const parsed = JSON.parse(text); // throws on bad JSON
  return { ...defaultCV, ...parsed };
}
```

- [ ] **Step 6: Run tests and verify they pass**

```bash
npx jest __tests__/cv-storage.test.ts
```

Expected: PASS — 6 tests.

- [ ] **Step 7: Commit**

```bash
git add lib/ __tests__/cv-storage.test.ts
git commit -m "feat: add CV types, defaults, and localStorage storage utilities"
```

---

## Task 3: CV HTML Preview Component

**Files:**
- Create: `components/cv/CVPreview.tsx`

**Interfaces:**
- Consumes: `CVData` from `lib/cv-types.ts`
- Produces: `<CVPreview data={cv} />` — used in `/cv` page and as live preview in editor

- [ ] **Step 1: Create CVPreview**

Create `components/cv/CVPreview.tsx`:
```tsx
import type { CVData } from '@/lib/cv-types';

export function CVPreview({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects } = data;
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-gray-900 font-sans text-sm">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{personal.name || 'Your Name'}</h1>
        {personal.title && <p className="text-lg text-gray-500 mt-1">{personal.title}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && (
            <a href={personal.website} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">
              {personal.website}
            </a>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      {summary && (
        <Section title="Summary">
          <p className="leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{exp.role}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {exp.company}{exp.location ? ` · ${exp.location}` : ''}
              </p>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc list-inside space-y-0.5 text-gray-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </p>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p className="leading-relaxed">{skills.join(' · ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{proj.name}</span>
                {proj.url && (
                  <a href={proj.url} className="text-xs underline text-blue-600 shrink-0 ml-2" target="_blank" rel="noreferrer">
                    Link ↗
                  </a>
                )}
              </div>
              {proj.description && <p className="text-gray-700">{proj.description}</p>}
              {proj.technologies.filter(Boolean).length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">{proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Verify it renders without error**

Create a quick smoke-check in `app/cv/page.tsx` (temporary):
```tsx
import { CVPreview } from '@/components/cv/CVPreview';
import { defaultCV } from '@/lib/cv-defaults';

export default function CVPage() {
  return <CVPreview data={defaultCV} />;
}
```

Run `npm run dev`, open `http://localhost:3000/cv`. Expected: a blank but structured CV template with "Your Name" placeholder.

- [ ] **Step 3: Commit**

```bash
git add components/cv/CVPreview.tsx app/cv/page.tsx
git commit -m "feat: add read-only CV preview component"
```

---

## Task 4: CV PDF Export

**Files:**
- Create: `components/cv/CVPDFDocument.tsx`
- Create: `components/cv/PDFExportButton.tsx`

**Interfaces:**
- Consumes: `CVData` from `lib/cv-types.ts`
- Produces: `<PDFExportButton data={cv} />` — renders a download link, dynamically imported

- [ ] **Step 1: Create PDF document template**

Create `components/cv/CVPDFDocument.tsx`:
```tsx
import {
  Document, Page, Text, View, Link, StyleSheet,
} from '@react-pdf/renderer';
import type { CVData } from '@/lib/cv-types';

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 3 },
  jobTitle: { fontSize: 12, color: '#555', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14, color: '#777', fontSize: 8 },
  sectionTitle: {
    fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5,
    color: '#999', borderBottomWidth: 1, borderBottomColor: '#ddd',
    paddingBottom: 2, marginBottom: 6, marginTop: 14,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bold: { fontWeight: 'bold' },
  sub: { color: '#666', fontSize: 8.5, marginBottom: 1 },
  bullet: { marginLeft: 10, marginBottom: 1.5 },
  tag: { color: '#888', fontSize: 8 },
});

export function CVPDFDocument({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects } = data;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{personal.name}</Text>
        {personal.title && <Text style={s.jobTitle}>{personal.title}</Text>}
        <View style={s.contactRow}>
          {personal.email && <Text>{personal.email}</Text>}
          {personal.phone && <Text>{personal.phone}</Text>}
          {personal.location && <Text>{personal.location}</Text>}
          {personal.website && <Link src={personal.website}>{personal.website}</Link>}
          {personal.linkedin && <Link src={personal.linkedin}>LinkedIn</Link>}
        </View>

        {summary ? (
          <>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text>{summary}</Text>
          </>
        ) : null}

        {experience.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{exp.role}</Text>
                  <Text style={s.sub}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                </View>
                <Text style={s.sub}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</Text>
                {exp.bullets.filter(Boolean).map((b, j) => (
                  <Text key={j} style={s.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {education.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={s.sub}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</Text>
                </View>
                <Text style={s.sub}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</Text>
              </View>
            ))}
          </>
        ) : null}

        {skills.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Skills</Text>
            <Text>{skills.join(' · ')}</Text>
          </>
        ) : null}

        {projects.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{proj.name}</Text>
                  {proj.url ? <Link src={proj.url} style={{ fontSize: 8, color: '#3b82f6' }}>Link</Link> : null}
                </View>
                {proj.description ? <Text>{proj.description}</Text> : null}
                {proj.technologies.filter(Boolean).length > 0 && (
                  <Text style={s.tag}>{proj.technologies.join(', ')}</Text>
                )}
              </View>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Create the export button with dynamic import**

Create `components/cv/PDFExportButton.tsx`:
```tsx
'use client';
import dynamic from 'next/dynamic';
import type { CVData } from '@/lib/cv-types';

// ponytail: dynamic imports required — @react-pdf/renderer uses browser canvas API, breaks SSR
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false }
);

const CVPDFDocument = dynamic(
  () => import('./CVPDFDocument').then(m => m.CVPDFDocument),
  { ssr: false }
);

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
```

- [ ] **Step 3: Add button to CV page and verify PDF downloads**

Update `app/cv/page.tsx` (temporary test):
```tsx
'use client';
import { CVPreview } from '@/components/cv/CVPreview';
import { PDFExportButton } from '@/components/cv/PDFExportButton';
import { defaultCV } from '@/lib/cv-defaults';

const testCV = {
  ...defaultCV,
  personal: { ...defaultCV.personal, name: 'Test User', title: 'Developer', email: 'test@example.com' },
  summary: 'A test summary.',
  skills: ['TypeScript', 'React', 'Next.js'],
};

export default function CVPage() {
  return (
    <main className="p-8">
      <PDFExportButton data={testCV} />
      <CVPreview data={testCV} />
    </main>
  );
}
```

Open `http://localhost:3000/cv`, click "Export PDF". Expected: PDF downloads with name, title, email, summary, skills.

- [ ] **Step 4: Commit**

```bash
git add components/cv/CVPDFDocument.tsx components/cv/PDFExportButton.tsx app/cv/page.tsx
git commit -m "feat: add PDF export via @react-pdf/renderer with dynamic import"
```

---

## Task 5: CV PDF Import (Text Extraction + Heuristic Parser)

**Files:**
- Create: `lib/cv-pdf-parser.ts`
- Create: `components/cv/PDFImporter.tsx`
- Create: `__tests__/cv-pdf-parser.test.ts`

**Interfaces:**
- Produces: `extractTextFromPDF(file: File): Promise<string[]>` and `parseLinesToCV(lines: string[]): Partial<CVData>` — used by `PDFImporter`
- Produces: `<PDFImporter onImport={(partial) => void} />` — used on `/cv` page

- [ ] **Step 1: Write failing tests for the parser**

Create `__tests__/cv-pdf-parser.test.ts`:
```typescript
import { parseLinesToCV } from '../lib/cv-pdf-parser';

test('extracts name from first non-empty line', () => {
  const result = parseLinesToCV(['Jane Doe', 'Software Engineer']);
  expect(result.personal?.name).toBe('Jane Doe');
});

test('extracts summary section', () => {
  const result = parseLinesToCV(['John', 'Summary', 'Passionate developer with 5 years experience']);
  expect(result.summary).toBe('Passionate developer with 5 years experience');
});

test('case-insensitive section headers', () => {
  const result = parseLinesToCV(['SKILLS', 'Python, Go, Rust']);
  expect(result.skills).toContain('Python');
  expect(result.skills).toContain('Go');
});

test('splits skills by comma', () => {
  const result = parseLinesToCV(['Skills', 'TypeScript, React, Node.js, PostgreSQL']);
  expect(result.skills).toHaveLength(4);
  expect(result.skills).toContain('Node.js');
});

test('splits skills by semicolon or pipe', () => {
  const result = parseLinesToCV(['Skills', 'Python; Java | Go']);
  expect(result.skills).toContain('Python');
  expect(result.skills).toContain('Java');
  expect(result.skills).toContain('Go');
});

test('returns empty object for empty input', () => {
  expect(parseLinesToCV([])).toEqual({});
});

test('handles input with only section headers', () => {
  const result = parseLinesToCV(['Experience', 'Education', 'Skills']);
  expect(result.experience).toBeDefined();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx jest __tests__/cv-pdf-parser.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement the parser**

Create `lib/cv-pdf-parser.ts`:
```typescript
import type { CVData } from './cv-types';
import { defaultCV } from './cv-defaults';

const SECTION_MAP: Record<string, keyof CVData> = {
  'experience': 'experience',
  'work experience': 'experience',
  'professional experience': 'experience',
  'employment': 'experience',
  'employment history': 'experience',
  'education': 'education',
  'academic background': 'education',
  'skills': 'skills',
  'technical skills': 'skills',
  'core competencies': 'skills',
  'technologies': 'skills',
  'summary': 'summary',
  'professional summary': 'summary',
  'objective': 'summary',
  'profile': 'summary',
  'about me': 'summary',
  'projects': 'projects',
  'personal projects': 'projects',
  'portfolio': 'projects',
};

const DATE_PATTERN = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present|current)\b/i;

export async function extractTextFromPDF(file: File): Promise<string[]> {
  // ponytail: dynamic import — pdfjs-dist uses browser Worker API, breaks if imported at module level in Next.js
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const lines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    for (const item of content.items) {
      const text = (item as { str?: string }).str?.trim();
      if (text) lines.push(text);
    }
  }

  return lines;
}

export function parseLinesToCV(lines: string[]): Partial<CVData> {
  if (!lines.length) return {};

  const result: Partial<CVData> = {};
  const sectionBuckets: Partial<Record<keyof CVData, string[]>> = {};
  let current: keyof CVData | null = null;

  // First non-empty line → name
  const firstLine = lines.find(l => l.trim().length > 2);
  if (firstLine) {
    result.personal = { ...defaultCV.personal, name: firstLine.trim() };
  }

  for (const line of lines) {
    const lower = line.toLowerCase().trim();
    const mapped = SECTION_MAP[lower];
    if (mapped) {
      current = mapped;
      sectionBuckets[current] = sectionBuckets[current] ?? [];
    } else if (current) {
      sectionBuckets[current]!.push(line);
    }
  }

  if (sectionBuckets.summary?.length) {
    result.summary = sectionBuckets.summary.join(' ');
  }

  if (sectionBuckets.skills?.length) {
    result.skills = sectionBuckets.skills
      .flatMap(l => l.split(/[,;|]/))
      .map(s => s.trim())
      .filter(Boolean);
  }

  if (sectionBuckets.experience?.length) {
    result.experience = groupIntoExperience(sectionBuckets.experience);
  }

  if (sectionBuckets.education?.length) {
    result.education = groupIntoEducation(sectionBuckets.education);
  }

  return result;
}

function groupIntoExperience(lines: string[]): CVData['experience'] {
  const entries: CVData['experience'] = [];
  let current: CVData['experience'][0] | null = null;

  for (const line of lines) {
    if (DATE_PATTERN.test(line)) {
      if (!current) {
        current = makeExp(line);
        entries.push(current);
      } else if (!current.startDate) {
        current.startDate = line;
      } else {
        current.bullets.push(line);
      }
    } else if (!current) {
      current = makeExp('');
      current.role = line;
      entries.push(current);
    } else if (!current.company) {
      current.company = line;
    } else {
      current.bullets.push(line);
    }
  }

  return entries;
}

function makeExp(dateOrTitle: string): CVData['experience'][0] {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: dateOrTitle,
    startDate: '',
    endDate: '',
    location: '',
    bullets: [],
  };
}

function groupIntoEducation(lines: string[]): CVData['education'] {
  // Simple: treat first line as institution, second as degree, rest as noise
  const result: CVData['education'] = [];
  let i = 0;
  while (i < lines.length && result.length < 4) {
    if (lines[i].trim()) {
      result.push({
        id: crypto.randomUUID(),
        institution: lines[i].trim(),
        degree: lines[i + 1]?.trim() ?? '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      });
      i += 2;
    } else {
      i++;
    }
  }
  return result;
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npx jest __tests__/cv-pdf-parser.test.ts
```

Expected: PASS — 7 tests.

- [ ] **Step 5: Create the PDF importer UI**

Create `components/cv/PDFImporter.tsx`:
```tsx
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
      {status === 'loading' && <p className="text-sm text-blue-600 mt-2">Extracting text…</p>}
      {status === 'error' && (
        <p className="text-sm text-red-500 mt-2">Failed to read the PDF. Try a different file.</p>
      )}
      {status === 'done' && (
        <div className="mt-3">
          <p className="text-xs text-green-600 font-medium">✓ Pre-filled from PDF — please review in the editor</p>
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
```

- [ ] **Step 6: Run all tests**

```bash
npx jest
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/cv-pdf-parser.ts components/cv/PDFImporter.tsx __tests__/cv-pdf-parser.test.ts
git commit -m "feat: add PDF text extraction and heuristic CV parser"
```

---

## Task 6: CV Editor

**Files:**
- Create: `components/cv/editor/PersonalInfoForm.tsx`
- Create: `components/cv/editor/SummaryForm.tsx`
- Create: `components/cv/editor/ExperienceForm.tsx`
- Create: `components/cv/editor/EducationForm.tsx`
- Create: `components/cv/editor/SkillsForm.tsx`
- Create: `components/cv/editor/ProjectsForm.tsx`
- Create: `components/cv/editor/CVEditor.tsx`

**Interfaces:**
- Consumes: all `lib/` types and storage utilities
- Produces: `<CVEditor initialData?: Partial<CVData> />` — used on `/cv/edit` page

- [ ] **Step 1: Create PersonalInfoForm**

Create `components/cv/editor/PersonalInfoForm.tsx`:
```tsx
'use client';
import type { PersonalInfo } from '@/lib/cv-types';

const FIELDS: { key: keyof PersonalInfo; label: string; type?: string }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'title', label: 'Job Title / Headline' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'location', label: 'Location (City, Country)' },
  { key: 'website', label: 'Website URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
];

export function PersonalInfoForm({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
}) {
  return (
    <div className="space-y-4">
      {FIELDS.map(({ key, label, type }) => (
        <label key={key} className="block">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <input
            type={type ?? 'text'}
            value={value[key]}
            onChange={e => onChange({ ...value, [key]: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create SummaryForm**

Create `components/cv/editor/SummaryForm.tsx`:
```tsx
'use client';

export function SummaryForm({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">Professional Summary</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        placeholder="A short paragraph describing your background, strengths, and goals…"
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </label>
  );
}
```

- [ ] **Step 3: Create ExperienceForm**

Create `components/cv/editor/ExperienceForm.tsx`:
```tsx
'use client';
import type { WorkExperience } from '@/lib/cv-types';

function blank(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    bullets: [''],
  };
}

export function ExperienceForm({
  value,
  onChange,
}: {
  value: WorkExperience[];
  onChange: (v: WorkExperience[]) => void;
}) {
  function patch(id: string, delta: Partial<WorkExperience>) {
    onChange(value.map(e => (e.id === id ? { ...e, ...delta } : e)));
  }

  return (
    <div className="space-y-6">
      {value.map((exp, idx) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Position #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(e => e.id !== exp.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['role', 'company', 'location'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">{field}</span>
              <input
                value={exp[field]}
                onChange={e => patch(exp.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-gray-600">
                  {field === 'startDate' ? 'Start' : 'End (or "Present")'}
                </span>
                <input
                  value={exp[field]}
                  onChange={e => patch(exp.id, { [field]: e.target.value })}
                  placeholder={field === 'endDate' ? 'Present' : ''}
                  className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600">Bullet Points</span>
            {exp.bullets.map((b, i) => (
              <div key={i} className="flex gap-2 mt-1.5">
                <input
                  value={b}
                  onChange={e => {
                    const bullets = exp.bullets.map((x, j) => (j === i ? e.target.value : x));
                    patch(exp.id, { bullets });
                  }}
                  placeholder="Describe an achievement or responsibility…"
                  className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => patch(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  aria-label="Remove bullet"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => patch(exp.id, { bullets: [...exp.bullets, ''] })}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              + Add bullet
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Position
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create EducationForm**

Create `components/cv/editor/EducationForm.tsx`:
```tsx
'use client';
import type { Education } from '@/lib/cv-types';

function blank(): Education {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  };
}

export function EducationForm({
  value,
  onChange,
}: {
  value: Education[];
  onChange: (v: Education[]) => void;
}) {
  function patch(id: string, delta: Partial<Education>) {
    onChange(value.map(e => (e.id === id ? { ...e, ...delta } : e)));
  }

  return (
    <div className="space-y-6">
      {value.map((edu, idx) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Education #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(e => e.id !== edu.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['institution', 'degree', 'field'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">{field}</span>
              <input
                value={edu[field]}
                onChange={e => patch(edu.id, { [field]: e.target.value })}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <div className="flex gap-3">
            {(['startDate', 'endDate', 'gpa'] as const).map(field => (
              <label key={field} className="flex-1">
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {field === 'gpa' ? 'GPA (optional)' : field === 'startDate' ? 'Start' : 'End'}
                </span>
                <input
                  value={edu[field]}
                  onChange={e => patch(edu.id, { [field]: e.target.value })}
                  className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Education
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create SkillsForm**

Create `components/cv/editor/SkillsForm.tsx`:
```tsx
'use client';
import { useState } from 'react';

export function SkillsForm({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  function addSkill() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 min-h-8">
        {value.map(skill => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => onChange(value.filter(s => s !== skill))}
              className="ml-1 text-blue-500 hover:text-red-500 font-bold leading-none"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a skill and press Enter or comma"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create ProjectsForm**

Create `components/cv/editor/ProjectsForm.tsx`:
```tsx
'use client';
import { useState } from 'react';
import type { Project } from '@/lib/cv-types';

function blank(): Project {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    technologies: [],
    url: '',
  };
}

export function ProjectsForm({
  value,
  onChange,
}: {
  value: Project[];
  onChange: (v: Project[]) => void;
}) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  function patch(id: string, delta: Partial<Project>) {
    onChange(value.map(p => (p.id === id ? { ...p, ...delta } : p)));
  }

  function addTech(id: string) {
    const tech = (techInputs[id] ?? '').trim();
    if (!tech) return;
    const proj = value.find(p => p.id === id)!;
    if (!proj.technologies.includes(tech)) {
      patch(id, { technologies: [...proj.technologies, tech] });
    }
    setTechInputs(prev => ({ ...prev, [id]: '' }));
  }

  return (
    <div className="space-y-6">
      {value.map((proj, idx) => (
        <div key={proj.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Project #{idx + 1}</span>
            <button
              onClick={() => onChange(value.filter(p => p.id !== proj.id))}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
          {(['name', 'url'] as const).map(field => (
            <label key={field} className="block">
              <span className="text-xs font-medium text-gray-600 capitalize">
                {field === 'url' ? 'URL (optional)' : field}
              </span>
              <input
                value={proj[field]}
                onChange={e => patch(proj.id, { [field]: e.target.value })}
                type={field === 'url' ? 'url' : 'text'}
                className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-xs font-medium text-gray-600">Description</span>
            <textarea
              value={proj.description}
              onChange={e => patch(proj.id, { description: e.target.value })}
              rows={2}
              className="mt-0.5 block w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </label>
          <div>
            <span className="text-xs font-medium text-gray-600">Technologies</span>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {proj.technologies.map(t => (
                <span key={t} className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {t}
                  <button
                    onClick={() => patch(proj.id, { technologies: proj.technologies.filter(x => x !== t) })}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={techInputs[proj.id] ?? ''}
                onChange={e => setTechInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id); } }}
                placeholder="React, TypeScript…"
                className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={() => addTech(proj.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, blank()])}
        className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
      >
        + Add Project
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Create CVEditor root**

Create `components/cv/editor/CVEditor.tsx`:
```tsx
'use client';
import { useEffect, useState } from 'react';
import type { CVData } from '@/lib/cv-types';
import { defaultCV } from '@/lib/cv-defaults';
import { loadCV, saveCV } from '@/lib/cv-storage';
import { CVPreview } from '../CVPreview';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';

const TABS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'] as const;
type Tab = (typeof TABS)[number];

export function CVEditor({ initialData }: { initialData?: Partial<CVData> }) {
  const [cv, setCV] = useState<CVData>(() => ({
    ...loadCV(),
    ...(initialData ?? {}),
  }));
  const [tab, setTab] = useState<Tab>('Personal');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    saveCV(cv);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [cv]);

  function update(patch: Partial<CVData>) {
    setCV(prev => ({ ...prev, ...patch }));
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Editor panel */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {saved && <span className="text-xs text-green-600">Saved</span>}
        </div>

        {tab === 'Personal' && (
          <PersonalInfoForm value={cv.personal} onChange={p => update({ personal: p })} />
        )}
        {tab === 'Summary' && (
          <SummaryForm value={cv.summary} onChange={s => update({ summary: s })} />
        )}
        {tab === 'Experience' && (
          <ExperienceForm value={cv.experience} onChange={e => update({ experience: e })} />
        )}
        {tab === 'Education' && (
          <EducationForm value={cv.education} onChange={e => update({ education: e })} />
        )}
        {tab === 'Skills' && (
          <SkillsForm value={cv.skills} onChange={s => update({ skills: s })} />
        )}
        {tab === 'Projects' && (
          <ProjectsForm value={cv.projects} onChange={p => update({ projects: p })} />
        )}
      </div>

      {/* Live preview — sticky, hidden on small screens */}
      <div className="hidden lg:block w-[440px] shrink-0 border border-gray-200 rounded-lg overflow-auto max-h-[calc(100vh-8rem)] sticky top-20">
        <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-400 font-medium">Live Preview</div>
        <CVPreview data={cv} />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Verify editor loads in browser**

Update `app/cv/edit/page.tsx`:
```tsx
import { CVEditor } from '@/components/cv/editor/CVEditor';

export default function EditPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit CV</h1>
      <CVEditor />
    </main>
  );
}
```

Open `http://localhost:3000/cv/edit`. Expected: tabbed editor on the left, live preview on the right (on wide screens). Typing in fields updates the preview immediately.

- [ ] **Step 9: Commit**

```bash
git add components/cv/editor/ app/cv/edit/
git commit -m "feat: add CV editor with all sections and live preview"
```

---

## Task 7: CV Page (Public View + All Import/Export Controls)

**Files:**
- Modify: `app/cv/page.tsx` (replace temp version from Task 3)

**Interfaces:**
- Consumes: `CVPreview`, `PDFExportButton`, `PDFImporter`, `cv-storage` utilities

- [ ] **Step 1: Replace CV page with full implementation**

Replace `app/cv/page.tsx`:
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { CVData } from '@/lib/cv-types';
import { loadCV, saveCV, exportJSON, importJSON } from '@/lib/cv-storage';
import { CVPreview } from '@/components/cv/CVPreview';
import { PDFExportButton } from '@/components/cv/PDFExportButton';
import { PDFImporter } from '@/components/cv/PDFImporter';

export default function CVPage() {
  const [cv, setCV] = useState<CVData | null>(null);
  const [showPDFImporter, setShowPDFImporter] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCV(loadCV()); }, []);

  function handleJSONImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(file)
      .then(data => { saveCV(data); setCV(data); })
      .catch(() => alert('Could not parse the JSON file.'));
    e.target.value = '';
  }

  function handlePDFImport(partial: Partial<CVData>) {
    setCV(prev => {
      if (!prev) return prev;
      const merged = { ...prev, ...partial };
      saveCV(merged);
      return merged;
    });
    setShowPDFImporter(false);
  }

  if (!cv) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/cv/edit"
          className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 font-medium"
        >
          ✏️ Edit CV
        </Link>
        <PDFExportButton data={cv} />
        <button
          onClick={() => exportJSON(cv)}
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Export JSON
        </button>
        <button
          onClick={() => jsonInputRef.current?.click()}
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Import JSON
        </button>
        <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={handleJSONImport} />
        <button
          onClick={() => setShowPDFImporter(v => !v)}
          className={`px-4 py-2 border rounded text-sm ${showPDFImporter ? 'bg-yellow-100 border-yellow-400' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          Import PDF
        </button>
      </div>

      {showPDFImporter && (
        <div className="mb-8">
          <PDFImporter onImport={handlePDFImport} />
        </div>
      )}

      <CVPreview data={cv} />
    </main>
  );
}
```

- [ ] **Step 2: Verify all controls work**

Open `http://localhost:3000/cv`.
- Click "Edit CV" → goes to `/cv/edit` ✓
- Click "Export PDF" → downloads PDF ✓
- Click "Export JSON" → downloads JSON file ✓
- Click "Import JSON" → file picker, select the just-exported JSON, CV reloads ✓
- Click "Import PDF" → shows importer panel ✓

- [ ] **Step 3: Commit**

```bash
git add app/cv/page.tsx
git commit -m "feat: wire up CV page with PDF export, JSON import/export, and PDF import"
```

---

## Task 8: Portfolio Landing Page

**Files:**
- Create: `components/portfolio/Hero.tsx`
- Create: `components/portfolio/About.tsx`
- Create: `components/portfolio/ProjectsSection.tsx`
- Create: `components/portfolio/Contact.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: full-page portfolio at `/` — edit placeholder text to match your own details

- [ ] **Step 1: Create Hero section**

Create `components/portfolio/Hero.tsx`:
```tsx
import Link from 'next/link';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
        Hello, I'm
      </p>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
        Your Name
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mb-8">
        Full-Stack Developer · Building fast, accessible web apps with React and Node.js.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cv"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View CV
        </Link>
        <a
          href="#projects"
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          See Projects
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create About section**

Create `components/portfolio/About.tsx`:
```tsx
export function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-6">About Me</h2>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          I'm a software developer based in [City, Country] with X years of experience
          building web applications. I specialize in [your specialties].
        </p>
        <p>
          When I'm not coding, I [your hobbies / interests]. I'm currently [open to opportunities /
          working at X / looking for Y].
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create Projects section**

Create `components/portfolio/ProjectsSection.tsx`:
```tsx
const PROJECTS = [
  {
    name: 'Project One',
    description: 'A short description of what this project does and the problem it solves.',
    tech: ['React', 'TypeScript', 'Node.js'],
    url: '#',
    repo: '#',
  },
  {
    name: 'Project Two',
    description: 'Another project description. Keep it to 1-2 sentences.',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL'],
    url: '#',
    repo: '#',
  },
  {
    name: 'Project Three',
    description: 'A third project. Replace these with your actual work.',
    tech: ['Python', 'FastAPI', 'Docker'],
    url: '#',
    repo: '#',
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map(p => (
            <div key={p.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tech.map(t => (
                  <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                <a href={p.url} className="text-blue-600 hover:underline">Demo ↗</a>
                <a href={p.repo} className="text-gray-500 hover:underline">GitHub ↗</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create Contact section**

Create `components/portfolio/Contact.tsx`:
```tsx
export function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">
        Whether you have a project in mind, a question, or just want to say hi —
        my inbox is open.
      </p>
      <div className="flex justify-center gap-6 text-sm">
        <a
          href="mailto:your@email.com"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Email Me
        </a>
        <a
          href="https://github.com/yourusername"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourprofile"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Assemble the landing page**

Replace `app/page.tsx`:
```tsx
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { Contact } from '@/components/portfolio/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectsSection />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 6: Verify the landing page**

Open `http://localhost:3000`. Expected: Hero → About → Projects → Contact sections, Navbar links scroll to anchors.

- [ ] **Step 7: Commit**

```bash
git add components/portfolio/ app/page.tsx
git commit -m "feat: add portfolio landing page with hero, about, projects, and contact"
```

---

## Task 9: Final Polish and Production Build

**Files:**
- Modify: `app/cv/edit/page.tsx` (import `PDFImporter` for edit-time PDF import)
- Modify: `components/Navbar.tsx` (active link highlight)
- Modify: `next.config.ts` (if needed for pdfjs worker)

**Interfaces:**
- Produces: `npm run build` succeeds with zero errors

- [ ] **Step 1: Add PDF import to the edit page**

Update `app/cv/edit/page.tsx` to expose PDF import directly in the editor (so users can start from an existing PDF):
```tsx
'use client';
import { useState } from 'react';
import type { CVData } from '@/lib/cv-types';
import { CVEditor } from '@/components/cv/editor/CVEditor';
import { PDFImporter } from '@/components/cv/PDFImporter';

export default function EditPage() {
  const [pdfImport, setPDFImport] = useState<Partial<CVData> | undefined>();
  const [showImporter, setShowImporter] = useState(false);

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
```

- [ ] **Step 2: Run full test suite**

```bash
npx jest
```

Expected: all tests pass.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Fix any TypeScript or build errors before proceeding.

- [ ] **Step 4: Smoke-test the production build**

```bash
npm run start
```

Open `http://localhost:3000`. Test:
1. Navigate all portfolio sections ✓
2. `/cv/edit` → add a name, job title, one skill ✓
3. `/cv` → CV shows the data ✓
4. Export PDF → downloads with correct name ✓
5. Export JSON → downloads JSON ✓
6. Import JSON (the just-exported file) → CV reloads ✓
7. Import PDF → file picker, upload any PDF, importer shows "pre-filled" message ✓

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: portfolio website complete — CV editor with PDF/JSON export and PDF import"
```

---

## Self-Review Checklist

- [x] **Portfolio landing page** — Hero, About, Projects, Contact (Task 8)
- [x] **CV editor** — all 6 sections with add/remove/live preview (Task 6)
- [x] **localStorage persistence** — auto-save on every change (Task 6, CVEditor)
- [x] **PDF export** — `@react-pdf/renderer` dynamic component (Task 4)
- [x] **JSON export** — downloads `.json` file (Task 2, cv-storage)
- [x] **JSON import** — parse file, merge with defaults (Task 2, cv-storage)
- [x] **PDF import** — `pdfjs-dist` text extraction + heuristic parser (Task 5)
- [x] **PDF import UX** — clearly communicates best-effort nature (Task 5, PDFImporter)
- [x] **SSR safety** — `pdfjs-dist` and `@react-pdf/renderer` dynamically imported (Tasks 4, 5)
- [x] **Unit tests** — cv-storage (6 tests) + cv-pdf-parser (7 tests) (Tasks 2, 5)
- [x] **Production build** — verified in Task 9
