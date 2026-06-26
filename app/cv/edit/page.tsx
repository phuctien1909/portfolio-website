import { CVEditor } from '@/components/cv/editor/CVEditor';

export default function EditPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit CV</h1>
      <CVEditor />
    </main>
  );
}
