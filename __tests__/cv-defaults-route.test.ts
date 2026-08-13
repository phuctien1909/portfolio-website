/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/cv-defaults/route';
import { defaultCV } from '@/lib/cv-defaults';

const ENV_KEYS = [
  'CV_PUBLISH_TOKEN',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test('GET falls back to baked-in default when Redis is not configured', async () => {
  const res = await GET();
  const body = await res.json();
  expect(body.personal.name).toBe(defaultCV.personal.name);
});

test('POST returns 503 when publishing is not configured', async () => {
  const res = await POST(new Request('http://test/api/cv-defaults', { method: 'POST' }));
  expect(res.status).toBe(503);
});

test('POST rejects a wrong or missing token', async () => {
  process.env.CV_PUBLISH_TOKEN = 's3cret';
  process.env.UPSTASH_REDIS_REST_URL = 'http://127.0.0.1:1';
  process.env.UPSTASH_REDIS_REST_TOKEN = 't';
  const wrong = await POST(
    new Request('http://test/api/cv-defaults', { method: 'POST', headers: { authorization: 'Bearer nope' } })
  );
  expect(wrong.status).toBe(401);
  const missing = await POST(new Request('http://test/api/cv-defaults', { method: 'POST' }));
  expect(missing.status).toBe(401);
});
