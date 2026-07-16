import type { Project } from '@/lib/cv-types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section id="projects" className="py-24 bg-white border-y border-zinc-200">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
          <span className="w-8 h-0.5 bg-violet-600 inline-block shrink-0" />
          Projects
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {projects.map(p => (
            <div
              key={p.id}
              className="rounded-xl border border-zinc-200 p-6 hover:border-violet-300 hover:shadow-md transition-all group bg-white"
            >
              <h3 className="font-semibold text-base mb-2 group-hover:text-violet-700 transition-colors">
                {p.name}
              </h3>
              <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.technologies.map(t => (
                  <span key={t} className="bg-violet-50 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
              {p.url && (
                <div className="flex gap-4 text-xs text-zinc-400">
                  <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-violet-700 transition-colors">
                    Visit ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
