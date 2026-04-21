'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Award, Scale, Calendar, User, Lock as LockIcon, Clock, Info,
  Star, Briefcase, Phone, Mail, CheckCircle, AlertCircle, ArrowLeft,
  DollarSign, Search, ShieldCheck, X, ChevronLeft, ChevronRight
} from 'lucide-react';

import Header from '@/components/layout/header';

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

  // Calendar & Filter State
  const [pivotDate, setPivotDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getWeekDays = (baseDate: Date) => {
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      days.push({
        full: d.toISOString().split('T')[0],
        dayName: d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        dateNum: d.getDate(),
        isToday: d.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  const weekDays = getWeekDays(pivotDate);

  const shiftWeek = (direction: number) => {
    const newPivot = new Date(pivotDate);
    newPivot.setDate(pivotDate.getDate() + (direction * 7));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (newPivot < today && direction < 0) {
      setPivotDate(today);
      return;
    }
    
    setPivotDate(newPivot);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string;

        // 1. Fetch Lawyer Profile
        const lawyerRes = await fetch(`/api/lawyer/${id}`);
        const lawyerData = await lawyerRes.json();

        if (lawyerRes.ok && lawyerData.success) {
          setLawyer(lawyerData.lawyer);
        }

        // 2. Fetch Slots
        const slotsRes = await fetch(`/api/lawyer/dashboard?lawyerId=${id}&type=appointments`);
        const slotsData = await slotsRes.json();
        if (slotsData.success) {
          const now = new Date();
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let filteredSlots = (slotsData.slots || []).filter((s: any) => {
            const sessionDate = new Date(s.date);
            sessionDate.setHours(0, 0, 0, 0);

            if (sessionDate < today) return false;

            if (sessionDate.getTime() === today.getTime() && s.time) {
              try {
                // Approximate time parsing "hh:mm AM" or "hh.mm AM"
                const startTimeStr = s.time.split('-')[0].trim();
                const clean = startTimeStr.replace('.', ':');
                const [timePart, period] = clean.split(' ');
                
                if (timePart) {
                  let [h, m] = timePart.split(':').map(Number);
                  if (period && period.toUpperCase() === 'PM' && h < 12) h += 12;
                  if (period && period.toUpperCase() === 'AM' && h === 12) h = 0;
                  
                  const sessionTime = new Date();
                  sessionTime.setHours(h, m || 0, 0, 0);
                  
                  // Hide if slot starts in the past
                  if (sessionTime <= now) return false;
                }
              } catch (e) {
                // If parsing fails, fall through to keep it visible
              }
            }
            return true;
          });

          const formatted = filteredSlots.map((s: any) => ({
            id: s.id,
            date: s.date,
            day: new Date(s.date).toLocaleString('default', { weekday: 'long' }),
            time: s.time,
            active: s.isBooked ? 1 : 0,
            total: 1,
            status: s.isBooked ? "FULL" : "AVAILABLE",
            parent_range: s.parent_range
          }));
          setSessions(formatted);
          if (formatted.length > 0 && !selectedDate) {
            setSelectedDate(formatted[0].date);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full mx-4">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Lawyer Not Found</h2>
            <p className="text-slate-600 mb-8">The profile you requested is unavailable or has been removed.</p>
            <button
              onClick={() => router.push('/lawyer')}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition"
            >
              Browse Valid Lawyers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header />

      {/* Hero Banner Area */}
      <div className="bg-slate-900 h-64 w-full relative">
        <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <button onClick={() => router.push('/lawyer')} className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-bold transition w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Lawyers
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">

        {/* Main Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
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
            <div className="flex-1 text-left">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lawyer.fullName}</h1>
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">{lawyer.practiceAreas?.join(', ') || 'Legal Counsel'}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {lawyer.province}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {lawyer.yearsOfExperience} Years Experience</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold border border-slate-200 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600" />
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" /> Professional Overview
                </h3>
                <p className="text-slate-600 leading-relaxed min-h-[100px]">{lawyer.bio}</p>
              </div>
            )}

            {/* Sessions Box */}
            <div id="booking-section">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-left">
                <Calendar className="w-5 h-5 text-amber-600" /> Available Sessions
              </h3>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <button onClick={() => shiftWeek(-1)} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto w-full justify-between pb-1 no-scrollbar px-2">
                    {weekDays.map((d, i) => {
                      const isActive = d.full === selectedDate;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(d.full)}
                          className={`flex flex-col items-center justify-center min-w-[64px] h-[80px] rounded-2xl border-2 transition-all ${isActive ? 'bg-amber-600 border-amber-600 text-white shadow-xl shadow-amber-600/20 scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-amber-400'} ${d.isToday && !isActive ? 'ring-2 ring-amber-100' : ''}`}
                        >
                          <span className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>{d.dayName}</span>
                          <span className="text-xl font-black">{d.dateNum}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => shiftWeek(1)} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm"><ChevronRight className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const displaySessions: any[] = [];
                    // Process all available sessions (no longer filtering by selected date)
                    const allSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    allSessions.forEach(s => {
                      const isRange = s.time.includes(' - ');

                      if (!s.parent_range && !isRange) {
                        displaySessions.push({ ...s, isGroup: false });
                      } else {
                        // It's a range or a grouped sub-slot
                        const effectiveRange = s.parent_range || s.time;
                        const groupKey = `group-${s.date}-${effectiveRange}`;
                        let group = displaySessions.find(g => g.id === groupKey);

                        if (!group) {
                          group = {
                            id: groupKey,
                            date: s.date,
                            day: s.day,
                            time: effectiveRange,
                            isGroup: true,
                            slots: [],
                            availableCount: 0
                          };
                          displaySessions.push(group);
                        }

                        // If it's a backend-split slot, add it
                        if (s.parent_range) {
                          group.slots.push(s);
                          if (s.status === 'AVAILABLE') group.availableCount++;
                        } else {
                          // It's an unsplit range record (legacy or fallback)
                          // Virtual split for frontend experience
                          const [s_start, s_end] = s.time.split(' - ');
                          if (s_start && s_end) {
                            const parseTime = (t: string) => {
                              const clean = t.replace('.', ':');
                              const [time, period] = clean.split(' ');
                              let [h, m] = time.split(':').map(Number);
                              if (period === 'PM' && h < 12) h += 12;
                              if (period === 'AM' && h === 12) h = 0;
                              const d = new Date();
                              d.setHours(h, m, 0, 0);
                              return d;
                            };

                            const formatTime = (d: Date) => {
                              let h = d.getHours();
                              const m = d.getMinutes();
                              const period = h >= 12 ? 'PM' : 'AM';
                              if (h > 12) h -= 12;
                              if (h === 0) h = 12;
                              return `${h.toString().padStart(2, '0')}.${m.toString().padStart(2, '0')} ${period}`;
                            };

                            try {
                              let current = parseTime(s_start);
                              const end = parseTime(s_end);
                              const virtualSlots = [];
                              while (current < end) {
                                const next = new Date(current.getTime() + 30 * 60000);
                                if (next > end) break;
                                virtualSlots.push(`${formatTime(current)} - ${formatTime(next)}`);
                                current = next;
                              }
                              virtualSlots.forEach(vs => {
                                group.slots.push({ ...s, time: vs, isVirtual: true });
                              });
                              if (s.status === 'AVAILABLE') group.availableCount = virtualSlots.length;
                            } catch (e) {
                              group.slots.push(s);
                              if (s.status === 'AVAILABLE') group.availableCount = 1;
                            }
                          } else {
                            group.slots.push(s);
                            if (s.status === 'AVAILABLE') group.availableCount = 1;
                          }
                        }
                      }
                    });

                    return displaySessions.length > 0 ? displaySessions.map((session) => {
                      const isGroup = session.isGroup;
                      const isAvailable = isGroup ? session.availableCount > 0 : session.status === 'AVAILABLE';

                      return (
                        <div key={session.id} className="relative pl-10 group pb-8 last:pb-0">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[6px] top-6 w-3 h-3 rounded-full ring-4 ring-white transition-all shadow-sm ${isAvailable ? 'bg-amber-500' : 'bg-slate-300'}`}></div>

                          <div className={`p-6 rounded-[2rem] border transition-all ${isAvailable ? 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-300' : 'bg-slate-50/50 border-slate-200 opacity-80'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${isAvailable ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {isGroup ? 'Consultation Range' : 'Session'}
                                  </span>
                                  <span className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span className="text-amber-600">{session.date}</span>
                                    <span className="text-slate-300 mx-1">|</span>
                                    {session.time}
                                  </span>
                                </div>

                                <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                  {isAvailable ? (isGroup ? 'Select a time for your meeting' : 'Open Available Slot') : 'Session Fully Booked'}
                                </h4>

                                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {lawyer.province || 'Online Consultation'}
                                  </div>
                                  {isGroup && (
                                    <div className="flex items-center gap-1.5 text-amber-600">
                                      <Info className="w-4 h-4" />
                                      {session.availableCount} slots available
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isAvailable ? (
                                  <button
                                    onClick={() => isGroup ? setSelectedGroup(session) : router.push(`/checkout?lawyer=${params.id}&slot=${session.id}`)}
                                    className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-amber-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                                  >
                                    Book Session
                                  </button>
                                ) : (
                                  <button disabled className="w-full md:w-auto px-10 py-4 bg-slate-100 text-slate-400 rounded-full font-black text-xs uppercase tracking-widest cursor-not-allowed">
                                    Sold Out
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="p-10 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No available sessions found at this time.</p>
                      </div>
                    );
                  })()}

                  {/* Placeholder for modal moved to bottom */}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Consultation Fee</p>
                <div className="flex items-end gap-2 text-slate-900">
                  <span className="text-[32px] font-black tracking-tight leading-none">LKR {lawyer.consultationFee?.toLocaleString() || '5,000'}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                <button onClick={() => { document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }) }} className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition text-sm flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" /> View Availability
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2 text-left">
                <Phone className="w-5 h-5 text-amber-600" /> Contact Info
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-sm text-slate-900 font-bold break-all">{lawyer.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                    <p className="text-sm text-slate-900 font-bold">{lawyer.phone || '+94 7X XXX XXXX'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-sm text-slate-900 font-bold">{lawyer.province} Province</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="text-center bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
              <ShieldCheck className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <p className="text-sm text-slate-900 font-bold mb-1">Need assistance or have questions?</p>
              <button className="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline underline-offset-4">Contact CogniLex Support</button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Booking Modal Popup */}
      {selectedGroup && (
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 py-12 transition-all duration-300"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedGroup(null); }}
        >
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col border border-white/20">
            <div className="p-6 md:p-10 flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-start mb-8 shrink-0">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Select Your Session</h3>
                  <p className="text-slate-500 font-bold text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" /> {new Date(selectedGroup.date).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm hover:rotate-90 duration-300"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 mb-8 flex items-center gap-5 text-left shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.1em] mb-1">Availability Range</p>
                  <p className="text-slate-900 font-black text-lg">{selectedGroup.time}</p>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1 pb-4">
                {selectedGroup.slots?.map((sub: any) => {
                  const subAvailable = sub.status === 'AVAILABLE';
                  return (
                    <div key={sub.id} className={`flex items-center justify-between p-5 bg-white border-2 ${subAvailable ? 'border-slate-100 hover:border-amber-400 hover:bg-amber-50/30' : 'border-slate-50 opacity-60'} rounded-2xl shadow-sm transition-all group`}>
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${subAvailable ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className={`text-[17px] font-black ${subAvailable ? 'text-slate-900' : 'text-slate-400'}`}>{sub.time}</span>
                      </div>
                      {subAvailable ? (
                        <button
                          onClick={() => router.push(`/checkout?lawyer=${params.id}&slot=${sub.id}`)}
                          className="px-6 py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-[13px] font-black uppercase tracking-wider transition-all shadow-lg group-hover:scale-105 active:scale-95"
                        >
                          Select
                        </button>
                      ) : (
                        <span className="text-[11px] font-black text-slate-400 uppercase bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">Full</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <p className="text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
                <LockIcon className="w-4 h-4 text-amber-600" /> Secure 256-bit Encrypted Session Booking
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}