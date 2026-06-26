import { CVPreview } from '@/components/cv/CVPreview';
import { defaultCV } from '@/lib/cv-defaults';

export default function CVPage() {
  return <CVPreview data={defaultCV} />;
}
