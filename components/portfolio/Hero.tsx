import Link from 'next/link';
import type { PersonalInfo } from '@/lib/cv-types';

export function Hero({ personal }: { personal: PersonalInfo }) {
  return (
    <section className="flex flex-col items-center justify-center min-h-[85vh] text-center px-6 bg-[#0C0A1E]">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-400 mb-5">
        Hello, I'm
      </p>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 bg-gradient-to-br from-white via-violet-100 to-violet-400 bg-clip-text text-transparent">
        {personal.name}
      </h1>
      <p className="text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed">
        {personal.title}
        {personal.location ? ` · ${personal.location}` : ''}
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/cv"
          className="px-6 py-3 bg-violet-700 text-white rounded-lg font-medium hover:bg-violet-600 transition-colors"
        >
          View CV
        </Link>
        <a
          href="#projects"
          className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg font-medium hover:border-zinc-400 hover:text-white transition-colors"
        >
          See Projects
        </a>
      </div>
    </section>
  );
}
