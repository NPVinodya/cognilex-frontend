import type { Province, Specialization } from './types';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const PROVINCES: Province[] = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
];

export const SPECIALIZATIONS: Specialization[] = [
  'Criminal Law',
  'Civil Law',
  'Family Law',
  'Corporate Law',
  'Property Law',
  'Labour Law',
  'Constitutional Law',
  'Tax Law',
  'Intellectual Property',
  'Environmental Law',
  'Immigration Law',
  'Banking Law',
];

export const GUEST_MESSAGE_LIMIT = 3;

export const SAMPLE_QUESTIONS = [
  'What are the requirements for registering a company in Sri Lanka?',
  'How do I file for divorce under Sri Lankan law?',
  'What are my rights as a tenant in Sri Lanka?',
  'How does inheritance law work in Sri Lanka?',
];

export const VETTING_FORM_STEPS = [
  {
    id: 1,
    title: 'Personal & Contact Information',
    description: 'Basic information and contact details',
  },
  {
    id: 2,
    title: 'Professional Verification',
    description: 'Bar credentials and practice details',
  },
];
export const USER_TYPES = [
  { value: 'student', label: 'Student', description: 'Legal education & research' },
  { value: 'citizen', label: 'Citizen', description: 'Legal guidance & support' },
  { value: 'lawyer', label: 'Lawyer', description: 'Knowledge hub & practice' },
] as const;
