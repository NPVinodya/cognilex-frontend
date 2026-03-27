'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, Award, Scale, Calendar, User, Lock, Clock, Info,
  Star, Briefcase, Phone, Mail, CheckCircle, AlertCircle, ArrowLeft,
  DollarSign, Search, ShieldCheck
} from 'lucide-react';

import Header from '@/components/layout/header';

const SESSIONS = [
  { id: 1, date: "February 02, 2026", day: "Monday", time: "04:00 PM", active: 10, total: 10, status: "FULL" },
  { id: 2, date: "February 02, 2026", day: "Monday", time: "05:00 PM", active: 5, total: 10, status: "AVAILABLE" },
  { id: 3, date: "February 06, 2026", day: "Friday", time: "08:30 PM", active: 20, total: 20, status: "FULL" },
  { id: 4, date: "February 09, 2026", day: "Monday", time: "04:00 PM", active: 2, total: 10, status: "AVAILABLE" },
  { id: 5, date: "February 10, 2026", day: "Tuesday", time: "03:00 PM", active: 0, total: 10, status: "AVAILABLE" },
];

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`/api/lawyer/${id}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setLawyer(data.lawyer);
        } else {
          setLawyer(null);
        }
      } catch (error) {
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchLawyer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF9000] border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full mx-4">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#181B25] mb-2">Lawyer Not Found</h2>
            <p className="text-slate-600 mb-8">The profile you requested is unavailable or has been removed.</p>
            <button 
              onClick={() => router.push('/lawyer')}
              className="w-full px-6 py-3 bg-[#181B25] hover:bg-[#0e1017] text-white rounded-xl font-bold transition"
            >
              Browse Valid Lawyers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <Header />

      {/* Hero Banner Area */}
      <div className="bg-[#181B25] h-64 w-full relative">
         <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
            <button onClick={() => router.push('/lawyer')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Lawyers
            </button>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        
        {/* Main Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-8 mb-8">
           <div className="flex flex-col md:flex-row gap-8 items-start">
             
             {/* Avatar Box */}
             <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100 -mt-16 md:-mt-20">
               {lawyer.profilePhotoUrl ? (
                  <img src={lawyer.profilePhotoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
             </div>

             {/* Core Info */}
             <div className="flex-1">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-bold text-[#181B25] tracking-tight">{lawyer.fullName}</h1>
                      <ShieldCheck className="w-6 h-6 text-[#FF9000]" />
                    </div>
                    <p className="text-slate-600 text-lg font-medium">{lawyer.practiceAreas?.join(', ') || 'Legal Counsel'}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {lawyer.province}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {lawyer.yearsOfExperience} Years Experience</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold border border-slate-200 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#FF9000]" />
                      BAR: {lawyer.barCouncilNumber}
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            {lawyer.bio && (
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-8">
                <h3 className="text-lg font-bold text-[#181B25] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FF9000]" /> Professional Overview
                </h3>
                <p className="text-slate-600 leading-relaxed min-h-[100px]">{lawyer.bio}</p>
              </div>
            )}

            {/* Sessions Box */}
            <div id="booking-section">
              <h3 className="text-lg font-bold text-[#181B25] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF9000]" /> Available Sessions
              </h3>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex gap-3 text-orange-800">
                <Info className="w-5 h-5 shrink-0 text-[#FF9000] mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-orange-900 mb-1">Important Consultation Notice</p>
                  <p>All consultations require prior documentation matching. No cancellations or refunds can be issued without direct permission from the respective lawyer.</p>
                </div>
              </div>

              <div className="space-y-4">
                {SESSIONS.map((session) => {
                  const isAvailable = session.status === 'AVAILABLE';
                  const availableSlots = session.total - session.active;

                  return (
                    <div key={session.id} className="bg-white border text-left border-slate-100 hover:border-orange-300 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 md:items-center">
                       
                       <div className="flex items-center gap-5 w-48 shrink-0">
                         <div className="bg-slate-50 border border-slate-200 text-center rounded-2xl p-3 min-w-[72px]">
                           <div className="text-[26px] font-black text-[#181B25] leading-none">{new Date(session.date).getDate()}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{new Date(session.date).toLocaleString('default', { month: 'short' })}</div>
                         </div>
                         <div>
                            <p className="font-bold text-[#181B25] text-[15px]">{session.day}</p>
                            <p className="text-[13px] font-bold text-slate-500 flex items-center gap-1.5 mt-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time}
                            </p>
                         </div>
                       </div>

                       <div className="flex-1">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {isAvailable ? `${availableSlots} Slots Open` : 'Fully Booked'}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{session.active}/{session.total} Confirmed</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${(session.active/session.total)*100}%` }}></div>
                          </div>
                       </div>

                       <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                         {isAvailable ? (
                             <button 
                               onClick={() => router.push(`/checkout?lawyer=${params.id}&slot=${session.id}`)}
                               className="w-full md:w-auto px-7 py-3 bg-[#FF9000] hover:bg-[#E68200] text-white rounded-full font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all text-sm"
                             >
                               Book Now
                             </button>
                           ) : (
                             <button disabled className="w-full md:w-auto px-7 py-3 bg-slate-100 text-slate-400 rounded-full font-bold cursor-not-allowed text-sm">
                               Not Available
                             </button>
                         )}
                       </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6">
            
            {/* Fee Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
              <div className="p-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Consultation Fee</p>
                <div className="flex items-end gap-2 text-[#181B25]">
                  <span className="text-[32px] font-black tracking-tight leading-none">LKR {lawyer.consultationFee?.toLocaleString() || '5,000'}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                 <button onClick={() => { document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }) }} className="w-full py-3.5 px-4 bg-[#181B25] hover:bg-[#0e1017] text-white rounded-xl font-bold transition text-sm shadow-sm flex items-center justify-center gap-2">
                   <Calendar className="w-4 h-4" /> View Availability
                 </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 p-6">
               <h3 className="font-bold text-[#181B25] text-base mb-5 flex items-center gap-2">
                 <Phone className="w-5 h-5 text-[#FF9000]" /> Contact Info
               </h3>
               <ul className="space-y-5">
                 <li className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                     <Mail className="w-5 h-5 text-[#FF9000]" />
                   </div>
                   <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                     <p className="text-sm text-[#181B25] font-bold break-all">{lawyer.email}</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                     <Phone className="w-5 h-5 text-[#FF9000]" />
                   </div>
                   <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                     <p className="text-sm text-[#181B25] font-bold">{lawyer.phone || '+94 7X XXX XXXX'}</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5 text-[#FF9000]" />
                   </div>
                   <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                     <p className="text-sm text-[#181B25] font-bold">{lawyer.province} Province</p>
                   </div>
                 </li>
               </ul>
            </div>

            <div className="text-center bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] rounded-2xl p-6 border border-slate-100">
              <ShieldCheck className="w-10 h-10 text-[#FF9000] mx-auto mb-3" />
              <p className="text-sm text-[#181B25] font-bold mb-1">Need assistance or have questions?</p>
              <button className="text-sm font-bold text-[#FF9000] hover:text-[#E68200] hover:underline underline-offset-4">Contact CogniLex Support</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}