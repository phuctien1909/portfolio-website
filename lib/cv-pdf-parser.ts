import type { CVData } from './cv-types';
import { defaultCV } from './cv-defaults';

// MM/YYYY - MM/YYYY  or  MM/YYYY - Present
const DATE_RANGE_RE = /(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present|current)/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/i;
// Require 11+ chars after the first digit so date fragments like "2024 - 02" don't match
const PHONE_RE = /\+?\d[\d\s\-().]{10,}/;

// Section headers as they appear in ALL CAPS in this PDF format
const KNOWN_SECTIONS = new Set([
  'SUMMARY', 'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE',
  'PROJECTS', 'PERSONAL PROJECTS',
  'EDUCATION', 'ACADEMIC BACKGROUND',
  'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'TECHNOLOGIES',
  'KEY ACHIEVEMENTS', 'ACHIEVEMENTS', 'CERTIFICATIONS',
  'STRENGTHS', 'UPCOMING GOAL', 'OBJECTIVE', 'PROFILE', 'ABOUT ME',
]);

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

  // ── Personal info: scan ALL lines with regex (order-independent) ──────────
  const emailLineIdx = lines.findIndex(l => EMAIL_RE.test(l));
  const emailLine = emailLineIdx >= 0 ? lines[emailLineIdx] : undefined;
  const email = emailLine?.match(EMAIL_RE)?.[0] ?? '';

  // Search for phone only near the email line to avoid matching date ranges
  const phoneSearchLines = emailLineIdx >= 0
    ? lines.slice(Math.max(0, emailLineIdx - 2), emailLineIdx + 3)
    : lines;
  const phone = phoneSearchLines.find(l => PHONE_RE.test(l))?.match(PHONE_RE)?.[0]?.trim() ?? '';

  // Name: ALL CAPS line, 2+ words, no digits, not a known section header
  const nameLine = lines.find(l => {
    const t = l.trim();
    return /^[A-Z][A-Z\s]+$/.test(t) && t.includes(' ') && !/\d/.test(t) && !KNOWN_SECTIONS.has(t);
  });
  const name = nameLine?.trim() ?? '';

  // Title: line immediately after name (not a section header, not contact)
  const nameIdx = nameLine ? lines.indexOf(nameLine) : -1;
  const titleCandidate = nameIdx >= 0 ? lines[nameIdx + 1]?.trim() : '';
  const title = titleCandidate && !KNOWN_SECTIONS.has(titleCandidate.toUpperCase()) && !EMAIL_RE.test(titleCandidate) && !PHONE_RE.test(titleCandidate)
    ? titleCandidate
    : '';

  // Location: short line matching "City, Country" near the contact block
  const contactIdx = emailLineIdx >= 0 ? emailLineIdx : nameIdx;
  const locationLine = lines
    .slice(Math.max(0, contactIdx - 2), contactIdx + 4)
    .find(l => /^[A-Z][a-zA-Z\s]+,\s*[A-Za-z\s]+$/.test(l.trim()) && l.trim() !== name);
  const location = locationLine?.trim() ?? '';

  const personal: CVData['personal'] = {
    ...defaultCV.personal,
    name,
    title,
    email,
    phone,
    location,
  };

  // ── Find section boundaries (order-independent) ───────────────────────────
  const sections: Array<{ name: string; idx: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const upper = lines[i].trim().toUpperCase();
    if (KNOWN_SECTIONS.has(upper)) sections.push({ name: upper, idx: i });
  }
  const sorted = [...sections].sort((a, b) => a.idx - b.idx);

  // Collect content from ALL occurrences of the same section header
  // (two-column PDFs often repeat headers across pages)
  function getSectionLines(sectionName: string): string[] {
    const result: string[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].name !== sectionName) continue;
      const next = sorted[i + 1];
      result.push(...lines.slice(sorted[i].idx + 1, next?.idx ?? lines.length));
    }
    return result;
  }

  // ── Orphan lines: content before the first section header ─────────────────
  // In two-column PDFs the experience content often renders before its header
  const firstSectionIdx = sorted[0]?.idx ?? lines.length;
  const orphanLines = lines.slice(0, firstSectionIdx).filter(l => l.trim());

  // ── Summary ───────────────────────────────────────────────────────────────
  const summary = getSectionLines('SUMMARY').join(' ').trim();

  // ── Skills ────────────────────────────────────────────────────────────────
  const skills = getSectionLines('SKILLS')
    .flatMap(l => l.split(/[,;]/))
    .map(s => s.trim())
    .filter(Boolean);

  // ── Education ─────────────────────────────────────────────────────────────
  const education = parseEducation(getSectionLines('EDUCATION'));

  // ── Experience ────────────────────────────────────────────────────────────
  // Merge orphan lines (where content renders before header) with section lines
  const experienceLines = [...orphanLines, ...getSectionLines('EXPERIENCE'), ...getSectionLines('WORK EXPERIENCE'), ...getSectionLines('PROFESSIONAL EXPERIENCE')];
  const experience = parseExperience(experienceLines);

  // ── Projects ─────────────────────────────────────────────────────────────
  const projectLines = [...getSectionLines('PROJECTS'), ...getSectionLines('PERSONAL PROJECTS')];
  const projects = parseProjects(projectLines);

  return { personal, summary, skills, education, experience, projects };
}

// ── Experience parser ──────────────────────────────────────────────────────
function parseExperience(lines: string[]): CVData['experience'] {
  const entries: CVData['experience'] = [];
  let current: CVData['experience'][0] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip lines that are just section headers we already processed
    if (KNOWN_SECTIONS.has(trimmed.toUpperCase())) continue;

    // "Role Title MM/YYYY - MM/YYYY" on one line
    const m = trimmed.match(/^(.+?)\s+(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present|current)/i);
    if (m) {
      current = {
        id: crypto.randomUUID(),
        role: m[1].trim(),
        company: '',
        location: '',
        startDate: m[2],
        endDate: m[3],
        bullets: [],
      };
      entries.push(current);
      continue;
    }

    if (!current) continue;

    if (!current.company) {
      current.company = trimmed;
      continue;
    }

    // Bullet: strip leading • - * characters
    const bullet = trimmed.replace(/^[•\-\*]\s*/, '');
    if (bullet) current.bullets.push(bullet);
  }

  return entries;
}

// ── Projects parser ────────────────────────────────────────────────────────
function parseProjects(lines: string[]): CVData['projects'] {
  const entries: CVData['projects'] = [];
  let current: CVData['projects'][0] | null = null;
  const descBuffer: string[] = [];

  function flushDesc() {
    if (current && descBuffer.length) {
      current.description = descBuffer.join(' ');
      descBuffer.length = 0;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (KNOWN_SECTIONS.has(trimmed.toUpperCase())) continue;

    // "Project Name MM/YYYY - MM/YYYY" on one line
    const m = trimmed.match(/^(.+?)\s+(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present|current)/i);
    if (m) {
      flushDesc();
      current = {
        id: crypto.randomUUID(),
        name: m[1].trim(),
        description: '',
        technologies: [],
        url: '',
        location: '',
        teamSize: '',
        role: '',
      };
      entries.push(current);
      continue;
    }

    if (!current) continue;

    if (/^team\s*size[:：]/i.test(trimmed)) {
      current.teamSize = trimmed.replace(/^team\s*size[:：]\s*/i, '');
    } else if (/^role[:：]/i.test(trimmed)) {
      current.role = trimmed.replace(/^role[:：]\s*/i, '');
    } else if (/^technologies?[:：]/i.test(trimmed)) {
      current.technologies = trimmed
        .replace(/^technologies?[:：]\s*/i, '')
        .split(/[,;]/)
        .map(t => t.replace(/\.{2,}$/, '').trim())
        .filter(Boolean);
    } else if (!current.location && trimmed.length <= 40 && !/[•\-\*]/.test(trimmed) && !trimmed.includes(':')) {
      // Short plain line right after project header = location
      current.location = trimmed;
    } else {
      const cleaned = trimmed.replace(/^[•\-\*]\s*/, '');
      if (cleaned) descBuffer.push(cleaned);
    }
  }

  flushDesc();
  return entries;
}

// ── Education parser ───────────────────────────────────────────────────────
function parseEducation(lines: string[]): CVData['education'] {
  const entries: CVData['education'] = [];
  let current: CVData['education'][0] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Stop if we hit the name (ALL CAPS bleed from adjacent column)
    if (/^[A-Z][A-Z\s]+$/.test(trimmed) && !trimmed.match(/\d/) && !KNOWN_SECTIONS.has(trimmed)) break;

    const dateMatch = trimmed.match(DATE_RANGE_RE);
    const gpaMatch = trimmed.match(/gpa[:：]?\s*([\d./]+)/i);

    if (gpaMatch && current) {
      current.gpa = gpaMatch[1];
    } else if (dateMatch && current) {
      current.startDate = dateMatch[1];
      current.endDate = dateMatch[2];
    } else if (!current) {
      current = {
        id: crypto.randomUUID(),
        degree: trimmed,
        field: '',
        institution: '',
        startDate: '',
        endDate: '',
        gpa: '',
      };
      entries.push(current);
    } else if (!current.institution && !EMAIL_RE.test(trimmed) && !PHONE_RE.test(trimmed)) {
      current.institution = trimmed;
    }
  }

  return entries;
}
