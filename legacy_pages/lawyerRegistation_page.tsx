'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Scale,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Camera,
  CreditCard,
  Image as ImageIcon,
  Moon,
  Sun,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

export default function LawyerRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    nicNumber: '',
    lawyerId: '',
    barCouncilNumber: '',
    specialization: '',
    yearsOfExperience: '',
    lawFirm: '',
    languagesSpoken: '',
    lawSchool: '',
    graduationYear: '',
    additionalQualifications: '',
    practiceAreas: [] as string[],
    consultationFee: '',
    availability: '',
    bio: '',
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [nicFrontPhoto, setNicFrontPhoto] = useState<File | null>(null);
  const [nicFrontPreview, setNicFrontPreview] = useState<string>('');
  const [nicBackPhoto, setNicBackPhoto] = useState<File | null>(null);
  const [nicBackPreview, setNicBackPreview] = useState<string>('');
  const [lawyerIdPhoto, setLawyerIdPhoto] = useState<File | null>(null);
  const [lawyerIdPreview, setLawyerIdPreview] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isWiping, setIsWiping] = useState(false);
  const [wipeColor, setWipeColor] = useState('bg-slate-950');

  const toggleDarkMode = () => {
    if (isWiping) return;
    
    const targetIsDark = !isDarkMode;
    setWipeColor(targetIsDark ? 'bg-slate-950' : 'bg-slate-50');
    setIsWiping(true);
    
    // Start the theme change halfway through the animation
    setTimeout(() => {
      setIsDarkMode(targetIsDark);
    }, 400);

    // Reset wiping state after animation completes
    setTimeout(() => {
      setIsWiping(false);
    }, 1000);
  };



  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      const email = parsed?.email || '';

      if (email) {
        setCurrentUserEmail(email);
        setFormData((prev) => ({ ...prev, email }));
      }
    } catch {
      // Keep existing email state if user payload is unavailable.
    }
  }, []);

  const practiceAreaOptions = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Property Law',
    'Labor Law',
    'Tax Law',
    'Intellectual Property',
    'Immigration Law',
    'Environmental Law',
  ];

  const provinceOptions = [
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePracticeAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter((a) => a !== area)
        : [...prev.practiceAreas, area],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;

      switch (type) {
        case 'profile':
          setProfilePhoto(file);
          setProfilePhotoPreview(preview);
          break;
        case 'nicFront':
          setNicFrontPhoto(file);
          setNicFrontPreview(preview);
          break;
        case 'nicBack':
          setNicBackPhoto(file);
          setNicBackPreview(preview);
          break;
        case 'lawyerId':
          setLawyerIdPhoto(file);
          setLawyerIdPreview(preview);
          break;
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!profilePhoto) {
      setError('Profile photo is required');
      setLoading(false);
      return;
    }
    if (!nicFrontPhoto || !nicBackPhoto) {
      setError('NIC card photos (front and back) are required');
      setLoading(false);
      return;
    }
    if (!lawyerIdPhoto) {
      setError('Lawyer ID card photo is required');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === 'practiceAreas') {
          formDataToSend.append(key, JSON.stringify(formData.practiceAreas));
        } else {
          formDataToSend.append(key, formData[key as keyof typeof formData] as string);
        }
      });

      formDataToSend.append('profilePhoto', profilePhoto);
      formDataToSend.append('nicFrontPhoto', nicFrontPhoto);
      formDataToSend.append('nicBackPhoto', nicBackPhoto);
      formDataToSend.append('lawyerIdPhoto', lawyerIdPhoto);

      const response = await fetch(`${API_BASE_URL}/lawyer/register`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data?.detail || data?.message || 'Registration failed. Please check your details and try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-green-200 dark:border-green-900">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Registration Submitted!</h2>
            <p className="text-gray-600 dark:text-slate-300 mb-4">Your application is under review. We'll notify you once it's approved.</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Horizontal Wipe Transition Overlay */}
      <div 
        className={`fixed inset-0 z-[60] pointer-events-none transition-all duration-800 ease-in-out ${
          isWiping ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${wipeColor}`}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl hover:scale-110 transition-all duration-300 group"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
          ) : (
            <Moon className="w-6 h-6 text-slate-700 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200">
                <Scale className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white">Join as a Lawyer</h1>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-lg">Register your practice with CogniLex AI</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">All fields are required for verification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Dr. Nimal Perera" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">NIC Number *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                    <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="200012345678 or 891234567V" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 cursor-not-allowed"
                      placeholder="Current user email"
                      title={currentUserEmail ? 'Email is locked to your current account' : 'No current user email found'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="+94 77 123 4567" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Colombo" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Province *</label>
                  <select name="province" value={formData.province} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100">
                    <option value="">Select Province</option>
                    {provinceOptions.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="123, Main Street, Colombo 03" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Lawyer Registration ID *</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                    <input type="text" name="lawyerId" value={formData.lawyerId} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="LK/LAW/2020/12345" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Bar Council Number *</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
                    <input type="text" name="barCouncilNumber" value={formData.barCouncilNumber} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="BAR/2020/12345" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Years of Experience *</label>
                  <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required min="0" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="5" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Primary Specialization *</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Criminal Law" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Law Firm / Chambers</label>
                  <input type="text" name="lawFirm" value={formData.lawFirm} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Perera & Associates" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Consultation Fee (LKR) *</label>
                  <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} required min="0" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="5000" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Languages Spoken *</label>
                  <input type="text" name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="English, Sinhala, Tamil" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <Camera className="w-6 h-6 text-pink-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Photo & Documents</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Profile Photo *</label>
                  <div className="relative w-full h-44 bg-gray-100 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon className="w-8 h-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" /><p className="text-xs text-gray-500 dark:text-slate-400">Upload Photo</p></div>}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">NIC Card (Front) *</label>
                  <div className="relative w-full h-40 bg-gray-100 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {nicFrontPreview ? <img src={nicFrontPreview} alt="NIC Front" className="w-full h-full object-cover" /> : <div className="text-center"><CreditCard className="w-8 h-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" /><p className="text-xs text-gray-500 dark:text-slate-400">Upload NIC Front</p></div>}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'nicFront')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">NIC Card (Back) *</label>
                  <div className="relative w-full h-40 bg-gray-100 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {nicBackPreview ? <img src={nicBackPreview} alt="NIC Back" className="w-full h-full object-cover" /> : <div className="text-center"><CreditCard className="w-8 h-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" /><p className="text-xs text-gray-500 dark:text-slate-400">Upload NIC Back</p></div>}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'nicBack')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Lawyer ID Card / Bar Council Certificate *</label>
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    {lawyerIdPreview ? <img src={lawyerIdPreview} alt="Lawyer ID" className="w-full h-full object-cover" /> : <div className="text-center"><Shield className="w-10 h-10 text-gray-400 dark:text-slate-500 mx-auto mb-2" /><p className="text-xs text-gray-500 dark:text-slate-400">Upload Lawyer ID / Bar Council Certificate</p></div>}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'lawyerId')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <GraduationCap className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education & Qualifications</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Law School / University *</label>
                  <input type="text" name="lawSchool" value={formData.lawSchool} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="University of Colombo" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Graduation Year *</label>
                  <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required min="1950" max={new Date().getFullYear()} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="2015" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Additional Qualifications</label>
                  <textarea name="additionalQualifications" value={formData.additionalQualifications} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="LLM in Criminal Law, Mediation Certificate..." />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <Award className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Areas *</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {practiceAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handlePracticeAreaToggle(area)}
                    className={`px-4 py-3 rounded-xl border transition font-medium text-sm ${formData.practiceAreas.includes(area)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:bg-white dark:hover:bg-slate-900'
                      }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                <FileText className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Profile</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Professional Bio *</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={5} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Tell clients about your experience..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Availability *</label>
                  <input type="text" name="availability" value={formData.availability} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500" placeholder="Mon-Fri: 9AM-5PM" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button type="button" onClick={() => router.push('/chat')} className="flex-1 px-8 py-4 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-2xl font-bold text-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition">Cancel</button>
              <button type="submit" disabled={loading || formData.practiceAreas.length === 0} className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
