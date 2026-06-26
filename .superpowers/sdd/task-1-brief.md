## Task 1: Project Initialization

**Files:**
- Create: project root (via `create-next-app`)
- Modify: `tailwind.config.ts` (content paths)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `components/Navbar.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: runnable Next.js dev server at `http://localhost:3000`, `npm test` passes with zero tests

- [ ] **Step 1: Scaffold Next.js project**

Run from the parent directory (`D:\Git projects`):
```bash
npx create-next-app@latest portfolio-website \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint
```

Expected output: `Success! Created portfolio-website`

- [ ] **Step 2: Install runtime dependencies**

```bash
cd portfolio-website
npm install @react-pdf/renderer pdfjs-dist
```

Expected: no peer-dep errors.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest
```

- [ ] **Step 4: Create jest config**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Create folder structure**

```bash
mkdir -p components/portfolio components/cv/editor lib __tests__
```

- [ ] **Step 6: Create Navbar**

Create `components/Navbar.tsx`:
```tsx
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
```

- [ ] **Step 7: Update root layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal portfolio and CV',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: server at `http://localhost:3000`, no compile errors.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Tailwind and test setup"
```

---

