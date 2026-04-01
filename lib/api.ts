// import type { User, Message, Lawyer, Appointment, VettingFormData } from './types';
// import { API_BASE_URL } from './constants';

// const getAuthToken = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('auth_token');
//   }
//   return null;
// };

// async function fetchAPI<T>(
//   endpoint: string,
//   options?: RequestInit
// ): Promise<T> {
//   const token = getAuthToken();
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options?.headers,
//   };
  
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });
  
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'Request failed' }));
//     throw new Error(error.message || error.detail || 'Request failed');
//   }
  
//   return response.json();
// }

// // Auth API
// export const authAPI = {
//   register: async (data: { email: string; password: string; name: string; userType: string }) => {
//     const response = await fetchAPI<{ access_token: string; user: User }>('/api/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
    
//     if (response.access_token) {
//       localStorage.setItem('auth_token', response.access_token);
//     }
    
//     return response;
//   },

//   login: async (email: string, password: string) => {
//     const response = await fetchAPI<{ access_token: string; user: User }>('/api/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
    
//     if (response.access_token) {
//       localStorage.setItem('auth_token', response.access_token);
//     }
    
//     return response;
//   },

//   logout: () => {
//     localStorage.removeItem('auth_token');
//   },

//   getCurrentUser: () => fetchAPI<{ user: User }>('/api/auth/me'),
// };

// // Chat API
// export const chatAPI = {
//   sendMessage: (message: string, conversationId?: string, isGuest: boolean = false) =>
//     fetchAPI<{ conversation_id?: string; response: string; citation?: any }>('/api/chat/send', {
//       method: 'POST',
//       body: JSON.stringify({ message, conversation_id: conversationId, is_guest: isGuest }),
//     }),

//   getConversations: () =>
//     fetchAPI<any[]>('/api/chat/conversations'),

//   getMessages: (conversationId: string) =>
//     fetchAPI<Message[]>(`/api/chat/conversations/${conversationId}/messages`),
// };

// // Lawyer API - Corrected to match your lawyer_route.py
// // lib/api.ts

// export const lawyerAPI = {
//   getAll: async (filters?: { province?: string; specialization?: string }) => {
//     const params = new URLSearchParams();
//     if (filters?.province) params.append('province', filters.province);
//     if (filters?.specialization) params.append('specialization', filters.specialization);
//     params.append('status', 'approved'); 
    
//     const queryString = params.toString();
//     const response = await fetchAPI<{ success: boolean; count: number; lawyers: Lawyer[] }>(
//       `/lawyer/all${queryString ? `?${queryString}` : ''}`
//     );
//     console.log("Response from Backend:", response);
//     return response.lawyers;
//   },


//   getById: (id: string) => fetchAPI<{ success: boolean; lawyer: Lawyer }>(`/lawyer/${id}`),

//   // Corrected to match the multi-part form data in lawyer_route.py
//   submitVetting: async (data: any, files: { [key: string]: File }) => {
//     const formData = new FormData();
    
//     // Append Text Fields
//     Object.keys(data).forEach(key => {
//       if (key === 'practiceAreas') {
//         formData.append(key, JSON.stringify(data[key]));
//       } else {
//         formData.append(key, data[key]);
//       }
//     });
    
//     // Append Files (profilePhoto, nicFrontPhoto, nicBackPhoto, lawyerIdPhoto)
//     Object.keys(files).forEach(key => {
//       formData.append(key, files[key]);
//     });

//     const response = await fetch(`${API_BASE_URL}/lawyer/register`, {
//       method: 'POST',
//       body: formData,
//       // No Content-Type header needed for FormData; browser sets it with boundary
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.detail || 'Registration submission failed');
//     }

//     return response.json();
//   },

//   getPending: () => fetchAPI<{ success: boolean; count: number; lawyers: Lawyer[] }>('/lawyer/pending'),
// };

// // Appointment API
// export const appointmentAPI = {
//   getAll: () => fetchAPI<Appointment[]>('/api/appointments'),

//   getByLawyer: (lawyerId: string) => 
//     fetchAPI<Appointment[]>(`/api/appointments/lawyer/${lawyerId}`),

//   create: (data: {
//     lawyerId: string;
//     date: string;
//     time: string;
//     appointmentType: string;
//     notes?: string;
//   }) =>
//     fetchAPI<Appointment>('/api/appointments', {
//       method: 'POST',
//       body: JSON.stringify({
//         lawyer_id: data.lawyerId,
//         date: data.date,
//         time: data.time,
//         appointment_type: data.appointmentType,
//         notes: data.notes,
//       }),
//     }),

//   updateStatus: (appointmentId: string, status: string) =>
//     fetchAPI<Appointment>(`/api/appointments/${appointmentId}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     }),

//   delete: (appointmentId: string) =>
//     fetchAPI<{ success: boolean }>(`/api/appointments/${appointmentId}`, {
//       method: 'DELETE',
//     }),
// };

// // Lawyer Dashboard API
// export const lawyerDashboardAPI = {
//   getStats: (lawyerId: string) =>
//     fetchAPI<any>(`/api/lawyer/${lawyerId}/stats`),

//   getCases: (lawyerId: string) =>
//     fetchAPI<any[]>(`/api/lawyer/${lawyerId}/cases`),

//   createCase: (lawyerId: string, caseData: any) =>
//     fetchAPI<any>(`/api/lawyer/${lawyerId}/cases`, {
//       method: 'POST',
//       body: JSON.stringify(caseData),
//     }),

//   updateCase: (caseId: string, updates: any) =>
//     fetchAPI<any>(`/api/cases/${caseId}`, {
//       method: 'PATCH',
//       body: JSON.stringify(updates),
//     }),

//   getDocuments: (lawyerId: string) =>
//     fetchAPI<any[]>(`/api/lawyer/${lawyerId}/documents`),

//   uploadDocument: async (lawyerId: string, file: File, metadata: any) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     Object.keys(metadata).forEach(key => {
//       formData.append(key, metadata[key]);
//     });

//     const token = getAuthToken();
//     const response = await fetch(`${API_BASE_URL}/api/lawyer/${lawyerId}/documents`, {
//       method: 'POST',
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Document upload failed');
//     }

//     return response.json();
//   },

//   deleteDocument: (documentId: string) =>
//     fetchAPI<{ success: boolean }>(`/api/documents/${documentId}`, {
//       method: 'DELETE',
//     }),

//   getReviews: (lawyerId: string) =>
//     fetchAPI<any[]>(`/api/lawyer/${lawyerId}/reviews`),

//   getAvailability: (lawyerId: string) =>
//     fetchAPI<any[]>(`/api/lawyer/${lawyerId}/availability`),

//   updateAvailability: (lawyerId: string, availability: any[]) =>
//     fetchAPI<any>(`/api/lawyer/${lawyerId}/availability`, {
//       method: 'PUT',
//       body: JSON.stringify({ availability }),
//     }),

//   getEarnings: (lawyerId: string, startDate?: string, endDate?: string) => {
//     const params = new URLSearchParams();
//     if (startDate) params.append('start_date', startDate);
//     if (endDate) params.append('end_date', endDate);
//     const queryString = params.toString();
//     return fetchAPI<any>(`/api/lawyer/${lawyerId}/earnings${queryString ? `?${queryString}` : ''}`);
//   },

//   updateProfile: (lawyerId: string, updates: any) =>
//     fetchAPI<any>(`/api/lawyer/${lawyerId}/profile`, {
//       method: 'PATCH',
//       body: JSON.stringify(updates),
//     }),

//   getNotifications: (lawyerId: string) =>
//     fetchAPI<any[]>(`/api/lawyer/${lawyerId}/notifications`),

//   markNotificationRead: (notificationId: string) =>
//     fetchAPI<{ success: boolean }>(`/api/notifications/${notificationId}/read`, {
//       method: 'PATCH',
//     }),
// };


import type { User, Message, Lawyer, Appointment, VettingFormData } from './types';
import { API_BASE_URL } from './constants';
import axios from 'axios';

// Create axios instance with interceptor for token
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Use 'accessToken' to match your login_page.tsx
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export the axios instance
export const api = axiosInstance;

// Keep your existing getAuthToken function
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken'); // Changed from 'auth_token' to 'accessToken'
  }
  return null;
};

// Rest of your existing code...
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.detail || 'Request failed');
  }
  
  return response.json();
}

// ... rest of your existing API exports