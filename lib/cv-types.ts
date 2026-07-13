export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  avatar?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  location?: string;
  teamSize?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certificates: Certificate[];
}

export interface CVVariant {
  id: string;
  name: string;
  updatedAt: string; // ISO date
  data: CVData;
}

export type ApplicationStatus = 'draft' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  url: string;
  appliedDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  notes: string;
  cvId: string | null; // references CVVariant.id; null when the variant was deleted
  updatedAt: string;
}
