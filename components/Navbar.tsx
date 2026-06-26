import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
      <Link href="/" className="font-bold text-lg">Portfolio</Link>
      <div className="flex gap-6 text-sm">
        <Link href="/#about" className="hover:text-blue-600">About</Link>
        <Link href="/#projects" className="hover:text-blue-600">Projects</Link>
        <Link href="/#contact" className="hover:text-blue-600">Contact</Link>
        <Link href="/cv" className="hover:text-blue-600 font-medium">CV</Link>
      </div>
    </nav>
  );
}
