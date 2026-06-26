export function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h2 className="text-2xl font-bold mb-3">Get In Touch</h2>
      <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
        Whether you have a project in mind, a question, or just want to say hi —
        my inbox is open.
      </p>
      <div className="flex justify-center gap-3 flex-wrap text-sm">
        <a
          href="mailto:your@email.com"
          className="px-5 py-2.5 bg-violet-700 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium"
        >
          Email Me
        </a>
        <a
          href="https://github.com/yourusername"
          className="px-5 py-2.5 border border-zinc-300 rounded-lg text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourprofile"
          className="px-5 py-2.5 border border-zinc-300 rounded-lg text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
