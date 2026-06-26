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
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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

  if (sectionBuckets.experience !== undefined) {
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
