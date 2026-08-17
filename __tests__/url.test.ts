import { externalHref } from '@/lib/url';

describe('externalHref', () => {
  it('keeps absolute http(s) links', () => {
    expect(externalHref('https://linkedin.com/in/me')).toBe('https://linkedin.com/in/me');
    expect(externalHref('HTTP://example.com')).toBe('HTTP://example.com');
  });

  it('prefixes https:// on pasted bare links', () => {
    expect(externalHref('linkedin.com/in/me')).toBe('https://linkedin.com/in/me');
    expect(externalHref('  www.example.com  ')).toBe('https://www.example.com');
  });

  it('drops empty and non-web schemes', () => {
    expect(externalHref('')).toBe('#');
    expect(externalHref(undefined)).toBe('#');
    expect(externalHref('javascript:alert(1)')).toBe('#');
  });
});
