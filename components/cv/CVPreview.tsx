import type { CVData } from '@/lib/cv-types';

function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : '#';
}

export function CVPreview({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects, certificates } = data;
  return (
    <div
      className="w-full p-6 bg-white text-zinc-800"
      style={{ fontFamily: "var(--font-open-sans, 'Open Sans', sans-serif)", fontSize: '15px', lineHeight: '1.6' }}
    >
      {/* Header */}
      <header className="mb-7 pb-5 border-b border-zinc-100 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 leading-tight">
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <p className="text-base text-violet-700 font-medium mt-1">{personal.title}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-sm text-zinc-500">
            {personal.email && <span className="break-all">{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.website && (
              <a href={safeUrl(personal.website)} className="underline decoration-zinc-300 hover:text-violet-700 hover:decoration-violet-400 break-all" target="_blank" rel="noreferrer">
                {personal.website}
              </a>
            )}
            {personal.linkedin && (
              <a href={safeUrl(personal.linkedin)} className="underline decoration-zinc-300 hover:text-violet-700 hover:decoration-violet-400" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>
        {personal.avatar && (
          <img
            src={personal.avatar}
            alt="Portrait"
            className="w-24 h-32 rounded-lg object-cover shrink-0 border border-zinc-200 shadow-sm"
          />
        )}
      </header>

      {summary && (
        <Section title="Summary">
          <p className="leading-relaxed text-zinc-600">{summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-zinc-900">{exp.role}</span>
                <span className="text-sm text-zinc-400 shrink-0 ml-2 tabular-nums">
                  {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                </span>
              </div>
              <p className="text-zinc-500 text-[13px] mt-0.5">
                {exp.company}{exp.location ? ` · ${exp.location}` : ''}
              </p>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-2 space-y-1 text-zinc-600">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-violet-500 shrink-0 mt-0.5">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-zinc-900">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                <span className="text-sm text-zinc-400 shrink-0 ml-2 tabular-nums">
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                </span>
              </div>
              <p className="text-zinc-500 text-[13px] mt-0.5">
                {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </p>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span key={i} className="bg-violet-50 text-violet-700 text-sm px-2.5 py-0.5 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map(proj => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-zinc-900">{proj.name}</span>
                <span className="text-sm text-zinc-400 shrink-0 ml-2 tabular-nums">
                  {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : proj.startDate ? ' – Present' : ''}
                </span>
              </div>
              {proj.url && (
                <a href={safeUrl(proj.url)} className="text-sm text-violet-600 hover:underline" target="_blank" rel="noreferrer">
                  Link ↗
                </a>
              )}
              {proj.description && <p className="text-zinc-600 mt-1">{proj.description}</p>}
              {proj.teamSize && (
                <p className="text-zinc-500 text-[13px] mt-1">• Team size: {proj.teamSize}</p>
              )}
              {proj.role && (
                <p className="text-zinc-500 text-[13px]">• Role: {proj.role}</p>
              )}
              {proj.technologies.filter(Boolean).length > 0 && (
                <p className="text-zinc-500 text-[13px]">• Technologies: {proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="Certificates">
          {certificates.map(cert => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-zinc-900">{cert.name}</span>
                <span className="text-sm text-zinc-400 shrink-0 ml-2">{cert.date}</span>
              </div>
              <p className="text-zinc-500 text-[13px] mt-0.5">
                {cert.issuer}
                {cert.url && (
                  <a href={safeUrl(cert.url)} className="ml-2 underline decoration-zinc-300 hover:text-violet-700" target="_blank" rel="noreferrer">
                    View ↗
                  </a>
                )}
              </p>
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
      <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
        <span className="w-3 h-0.5 bg-violet-500 inline-block shrink-0" />
        {title}
      </h2>
      {children}
    </section>
  );
}
