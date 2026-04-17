export type Role = 'user' | 'seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  size?: string;
  contacts: {
    phone?: string;
    email?: string;
    website?: string;
  };
  vacancies?: Vacancy[];
}

export type JobType = 'full' | 'part' | 'remote' | 'hybrid' | 'internship';

export interface Vacancy {
  id: string;
  title: string;
  companyId: string;
  salary: {
    min: number;
    max?: number;
    currency: 'KZT' | 'USD';
  };
  location: string;
  type: JobType;
  category: string;
  description: string;
  requirements: string[];
  company?: Company;
  createdAt: string;
  emoji?: string;
}

export interface Resume {
  id: string;
  userId: string;
  personal: {
    name: string;
    photo?: string;
    phone: string;
    about: string;
  };
  skills: string[];
  experience: {
    id: string;
    job: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    period: string;
  }[];
  updatedAt: string;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  vacancyId: string;
  resumeId?: string;
  userId: string;
  status: ApplicationStatus;
  date: string;
}
