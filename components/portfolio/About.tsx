export function About({ summary }: { summary: string }) {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-violet-700 mb-2">{'// about'}</p>
      <h2 className="font-display text-3xl font-bold mb-8">About Me</h2>
      <div className="space-y-5 text-zinc-600 leading-loose text-base">
        <p className="whitespace-pre-line">{summary}</p>
      </div>
    </section>
  );
}
