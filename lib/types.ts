export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'citizen' | 'lawyer';
  createdAt: string;
}

export interface Lawyer {
  id: string;
  name: string; // Changed to match LawyerResponse
  email: string;
  userType: string;
  createdAt: string;
  barNumber: string; // Changed to match LawyerResponse
  province: string;
  specializations: string[]; // Changed to match LawyerResponse
  yearsOfPractice: number; // Changed to match LawyerResponse
  rating: number;
  totalCases: number; // Changed to match LawyerResponse
  vettingStatus: string;
  address: string;
  phone: string;
  profilePhotoUrl?: string;
  bio?: string;
  consultationFee?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citation?: Citation;
}

export interface Citation {
  source: string;
  section: string;
  link: string;
  relevance?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  lawyerId: string;
  lawyerName: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  appointmentType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export type Province =
  | 'Western'
  | 'Central'
  | 'Southern'
  | 'Northern'
  | 'Eastern'
  | 'North Western'
  | 'North Central'
  | 'Uva'
  | 'Sabaragamuwa';

export type Specialization =
  | 'Criminal Law'
  | 'Civil Law'
  | 'Family Law'
  | 'Corporate Law'
  | 'Property Law'
  | 'Labour Law'
  | 'Constitutional Law'
  | 'Tax Law'
  | 'Intellectual Property'
  | 'Environmental Law'
  | 'Immigration Law'
  | 'Banking Law';

export interface VettingFormData {
  fullName: string;
  barNumber: string;
  phone: string;
  email: string;
  address: string;
  province: Province | '';
  specializations: Specialization[];
  yearsOfPractice: number;
  certificate?: File;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Lawyer Dashboard Types
export interface LawyerDashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeCases: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
}

export interface Case {
  id: string;
  caseNumber: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  caseType: Specialization;
  status: 'active' | 'pending' | 'closed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  nextHearing?: string;
  courtName?: string;
  documents: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  category: 'contract' | 'evidence' | 'report' | 'certificate' | 'other';
  caseId?: string;
  url: string;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  appointmentId: string;
  createdAt: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface EarningsRecord {
  id: string;
  appointmentId: string;
  clientName: string;
  amount: number;
  date: string;
  paymentStatus: 'pending' | 'completed' | 'refunded';
  paymentMethod: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'case' | 'payment' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

