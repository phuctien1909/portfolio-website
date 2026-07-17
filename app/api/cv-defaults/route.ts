import { defaultCV } from '@/lib/cv-defaults';

const KEY = 'cv:default';

// Upstash Redis REST API — env vars come from the Vercel Marketplace integration
// (UPSTASH_*) or the older Vercel KV naming (KV_*). ponytail: plain fetch, two
// commands don't justify the @upstash/redis dependency.
const redisUrl = () => process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = () => process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(redisUrl()!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${redisToken()}` },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  return (await res.json()).result;
}

// Published CV for visitors; baked-in default when nothing published or Redis is unreachable
export async function GET() {
  try {
    if (redisUrl()) {
      const stored = await redis(['GET', KEY]);
      if (typeof stored === 'string') return Response.json(JSON.parse(stored));
    }
  } catch {
    /* fall through to baked-in default */
  }
  return Response.json(defaultCV);
}

export async function POST(req: Request) {
  const secret = process.env.CV_PUBLISH_TOKEN;
  if (!secret || !redisUrl()) return new Response('Publishing not configured', { status: 503 });
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const data = await req.json();
  await redis(['SET', KEY, JSON.stringify(data)]);
  return new Response(null, { status: 204 });
}
