import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#F8F7F4]/90 backdrop-blur-sm sticky top-0 z-10">
      <Link href="/" className="font-bold text-base tracking-tight text-zinc-900">Portfolio</Link>
      <div className="flex gap-6 text-sm text-zinc-500">
        <Link href="/#about" className="hover:text-violet-700 transition-colors">About</Link>
        <Link href="/#projects" className="hover:text-violet-700 transition-colors">Projects</Link>
        <Link href="/#contact" className="hover:text-violet-700 transition-colors">Contact</Link>
        <Link href="/cv" className="hover:text-violet-700 font-semibold text-zinc-800 transition-colors">CV</Link>
      </div>
    </nav>
  );
}
