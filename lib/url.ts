/** Normalize a user-pasted link into a usable href. Bare domains get https://; unknown schemes are dropped. */
export function externalHref(url: string | undefined | null): string {
  const u = (url ?? '').trim();
  if (!u) return '#';
  if (/^https?:\/\//i.test(u)) return u;
  // ponytail: any other scheme (javascript:, data:, ...) is not a website link
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '#';
  return `https://${u}`;
}
