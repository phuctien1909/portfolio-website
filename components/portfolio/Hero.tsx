import Link from 'next/link';
import type { PersonalInfo } from '@/lib/cv-types';

export function Hero({ personal, skills }: { personal: PersonalInfo; skills: string[] }) {
  const specName = `${(personal.name.split(' ').pop() || 'cv').toLowerCase()}.spec.ts`;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-6 bg-[#0C0A1E] overflow-hidden">
      {/* faint blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="relative">
        <p className="rise font-mono text-xs tracking-[0.25em] text-violet-400 mb-5">
          {'// hello, I\'m'}
        </p>
        <h1 className="rise rise-1 font-display text-5xl md:text-7xl font-bold tracking-tight mb-5 bg-gradient-to-br from-white via-violet-100 to-violet-400 bg-clip-text text-transparent">
          {personal.name}
        </h1>
        <p className="rise rise-2 text-lg text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {personal.title}
          {personal.location ? ` · ${personal.location}` : ''}
        </p>

        {skills.length > 0 && (
          <div className="rise rise-3 inline-block text-left font-mono text-[13px] leading-6 bg-white/[0.04] border border-white/10 rounded-lg px-5 py-4 mb-10 backdrop-blur-sm">
            <p className="mb-1">
              <span className="bg-emerald-500/15 text-emerald-300 font-semibold px-1.5 py-0.5 rounded mr-2">
                PASS
              </span>
              <span className="text-zinc-300">{specName}</span>
            </p>
            {skills.slice(0, 3).map(skill => (
              <p key={skill} className="text-zinc-400">
                <span className="text-emerald-400 mr-2">✓</span>
                {skill}
              </p>
            ))}
          </div>
        )}

        <div className="rise rise-4 flex gap-4 flex-wrap justify-center">
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
      </div>
    </section>
  );
}
