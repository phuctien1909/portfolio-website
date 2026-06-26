const PROJECTS = [
  {
    name: 'Project One',
    description: 'A short description of what this project does and the problem it solves.',
    tech: ['React', 'TypeScript', 'Node.js'],
    url: '#',
    repo: '#',
  },
  {
    name: 'Project Two',
    description: 'Another project description. Keep it to 1-2 sentences.',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL'],
    url: '#',
    repo: '#',
  },
  {
    name: 'Project Three',
    description: 'A third project. Replace these with your actual work.',
    tech: ['Python', 'FastAPI', 'Docker'],
    url: '#',
    repo: '#',
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map(p => (
            <div key={p.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tech.map(t => (
                  <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex gap-3 text-sm">
                <a href={p.url} className="text-blue-600 hover:underline">Demo ↗</a>
                <a href={p.repo} className="text-gray-500 hover:underline">GitHub ↗</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
