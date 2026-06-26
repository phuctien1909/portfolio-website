import type { CVData } from './cv-types';

export const defaultCV: CVData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};
