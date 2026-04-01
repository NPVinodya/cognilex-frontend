import { z } from 'zod';
import { PROVINCES, SPECIALIZATIONS } from './constants';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['student', 'citizen', 'lawyer']),
});

export const vettingFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  barNumber: z.string().regex(/^BASL-\d{5}-\d{4}$/, 'Invalid bar number format (BASL-XXXXX-YYYY)'),
  phone: z.string().regex(/^(\+94|0)?[0-9]{9,10}$/, 'Invalid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  province: z.enum(PROVINCES as [string, ...string[]]),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization').max(3, 'Maximum 3 specializations'),
  yearsOfPractice: z.number().min(0, 'Must be 0 or greater').max(50, 'Must be 50 or less'),
});

export const appointmentSchema = z.object({
  lawyerId: z.string().min(1, 'Lawyer ID is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  notes: z.string().optional(),
});