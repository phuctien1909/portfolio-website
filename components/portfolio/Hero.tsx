import Link from 'next/link';

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
        Hello, I'm
      </p>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
        Your Name
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mb-8">
        Full-Stack Developer · Building fast, accessible web apps with React and Node.js.
      </p>
      <div className="flex gap-4">
        <Link
          href="/cv"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View CV
        </Link>
        <a
          href="#projects"
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          See Projects
        </a>
      </div>
    </section>
  );
}
