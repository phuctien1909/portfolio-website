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
