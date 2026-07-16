import type { PersonalInfo } from '@/lib/cv-types';

function externalHref(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`;
}

export function Contact({ personal }: { personal: PersonalInfo }) {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="font-mono text-xs text-violet-700 mb-2">{'// contact'}</p>
      <h2 className="font-display text-3xl font-bold mb-3">Get In Touch</h2>
      <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
        Whether you have a project in mind, a question, or just want to say hi —
        my inbox is open.
      </p>
      <div className="flex justify-center gap-3 flex-wrap text-sm">
        {personal.email && (
          <a
            href={`mailto:${personal.email}`}
            className="px-5 py-2.5 bg-violet-700 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium"
          >
            Email Me
          </a>
        )}
        {personal.website && (
          <a
            href={externalHref(personal.website)}
            className="px-5 py-2.5 border border-zinc-300 rounded-lg text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Website
          </a>
        )}
        {personal.linkedin && (
          <a
            href={externalHref(personal.linkedin)}
            className="px-5 py-2.5 border border-zinc-300 rounded-lg text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>
      {personal.email && (
        <p className="font-mono text-xs text-zinc-400 mt-8">{personal.email}</p>
      )}
    </section>
  );
}
