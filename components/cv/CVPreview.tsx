import type { CVData } from '@/lib/cv-types';

function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : '#';
}

export function CVPreview({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects } = data;
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-gray-900 font-sans text-sm">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{personal.name || 'Your Name'}</h1>
        {personal.title && <p className="text-lg text-gray-500 mt-1">{personal.title}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && (
            <a href={safeUrl(personal.website)} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">
              {personal.website}
            </a>
          )}
          {personal.linkedin && (
            <a href={safeUrl(personal.linkedin)} className="underline hover:text-blue-600" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </header>

      {summary && (
        <Section title="Summary">
          <p className="leading-relaxed">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{exp.role}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {exp.company}{exp.location ? ` · ${exp.location}` : ''}
              </p>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc list-inside space-y-0.5 text-gray-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </p>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p className="leading-relaxed">{skills.join(' · ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{proj.name}</span>
                {proj.url && (
                  <a href={safeUrl(proj.url)} className="text-xs underline text-blue-600 shrink-0 ml-2" target="_blank" rel="noreferrer">
                    Link ↗
                  </a>
                )}
              </div>
              {proj.description && <p className="text-gray-700">{proj.description}</p>}
              {proj.technologies.filter(Boolean).length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">{proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
