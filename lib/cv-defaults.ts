import type { CVData } from './cv-types';
import data from './cv-default-data.json';

// Baked-in CV shown to visitors with no localStorage. Saving the "Master"
// variant while running `npm run dev` rewrites cv-default-data.json via
// /api/cv-defaults; commit + redeploy to publish.
export const defaultCV: CVData = data as CVData;
