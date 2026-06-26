export function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
      <p className="text-gray-500 mb-8 max-w-lg mx-auto">
        Whether you have a project in mind, a question, or just want to say hi —
        my inbox is open.
      </p>
      <div className="flex justify-center gap-6 text-sm">
        <a
          href="mailto:your@email.com"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Email Me
        </a>
        <a
          href="https://github.com/yourusername"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourprofile"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
