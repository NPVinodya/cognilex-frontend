"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock4,
  Search,
  Scale,
  Loader2,
  AlertCircle,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  lawyerName: string;
  lawyerImage?: string;
  type: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Pending" | "Canceled" | "Completed";
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past" | "Canceled">("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          // If not logged in, redirect to login
          router.push("/login");
          return;
        }

        const user = JSON.parse(storedUser);
        const userEmail = user.email;

        if (!userEmail) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/user/appointments?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();

        if (data.success && data.appointments) {
          setAppointments(data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Failed to fetch user appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  const filteredAppointments = appointments.filter((apt) => {
    // Filter by search
    const matchesSearch = apt.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matchesTab = false;
    if (activeTab === "Canceled") {
      matchesTab = apt.status === "Canceled";
    } else if (activeTab === "Upcoming") {
      matchesTab = apt.status !== "Canceled" && apt.status !== "Completed" && aptDate >= today;
    } else if (activeTab === "Past") {
      matchesTab = apt.status === "Completed" || (apt.status !== "Canceled" && aptDate < today);
    }

    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Pending": return "bg-orange-50 text-[#FF9000] border-orange-100";
      case "Completed": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Canceled": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed": return <CheckCircle2 className="w-3 h-3" />;
      case "Pending": return <Clock4 className="w-3 h-3" />;
      case "Completed": return <CheckCircle2 className="w-3 h-3" />;
      case "Canceled": return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes('consultation')) return 'bg-orange-50 text-orange-600';
    if (t.includes('court')) return 'bg-purple-50 text-purple-600';
    if (t.includes('document') || t.includes('review')) return 'bg-blue-50 text-blue-600';
    if (t.includes('meeting')) return 'bg-emerald-50 text-emerald-600';
    return 'bg-slate-100 text-slate-600';
  };

  const handleDownloadReceipt = (apt: Appointment) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text("CogniLex", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("Payment Receipt", 105, 30, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Details
    doc.setFontSize(12);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    doc.text(`Client Name: ${user.name || user.email || "User"}`, 20, 45);
    doc.text(`Email: ${user.email || ""}`, 20, 52);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 45);
    doc.text(`Receipt No: #${apt.id.split('-')[1] || Math.floor(Math.random() * 1000000)}`, 140, 52);

    // Table
    autoTable(doc, {
      startY: 70,
      head: [["Description", "Amount (LKR)"]],
      body: [
        [`Legal Consultation with ${apt.lawyerName}`, "2,500"],
        ["Service Fee", "200"],
      ],
      foot: [["Total Paid", "2,700"]],
      theme: "striped",
      headStyles: { fillColor: [217, 119, 6] },
      footStyles: { fillColor: [51, 51, 51] }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for using CogniLex.", 105, finalY + 20, { align: "center" });

    doc.save(`CogniLex_Receipt_${apt.id.split('-')[1] || apt.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex flex-col">
      <Header />

      {/* Page Header Area */}
      <div className="pt-10 pb-32 w-full relative text-left bg-slate-900">
        <div className="absolute inset-0 mix-blend-multiply opacity-20 bg-amber-900"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-outfit text-white mb-2">
              My Appointments
            </h1>
            <p className="text-slate-300 font-medium text-sm md:text-base font-inter">
              Track and manage your legal consultations seamlessly.
            </p>
          </div>
          <button
            onClick={() => router.push("/lawyer")}
            className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-3 rounded-xl shadow-lg shadow-orange-600/20 text-sm font-bold transition font-inter active:scale-95 whitespace-nowrap"
          >
            <Scale className="w-4 h-4" /> Book New Session
          </button>
        </div>
      </div>

      {/* Main Content Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20 w-full flex-1">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Controls Bar */}
          <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50">
            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/50">
              {(["Upcoming", "Past", "Canceled"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all font-inter ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search lawyer, type or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium font-inter text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 bg-white">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 px-8 border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-widest font-inter">
              <div className="col-span-4">Lawyer Details</div>
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="divide-y divide-slate-100/80">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" />
                  <span className="font-medium font-inter text-sm">Loading your appointments...</span>
                </div>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 md:px-8 items-center hover:bg-slate-50/50 transition duration-150 group"
                  >
                    {/* Mobile Only Header inside card */}
                    <div className="md:hidden flex items-center justify-between mb-2">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        {apt.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownloadReceipt(apt)}
                          className="p-1 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-md transition-colors border border-transparent hover:border-amber-200"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">ID: {apt.id.split('-')[1] || apt.id}</p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm group-hover:shadow transition">
                        <img 
                          src={apt.lawyerImage || "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200"} 
                          alt={apt.lawyerName}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className="text-[15px] font-bold text-slate-900 truncate font-inter">
                          {apt.lawyerName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest ${getTypeColor(apt.type)}`}>
                            {apt.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5 justify-center">
                      <p className="text-[14px] font-bold text-slate-900 flex items-center gap-2 font-inter">
                        <CalendarIcon className="w-4 h-4 text-amber-600" />
                        {new Date(apt.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2 font-inter">
                        <Clock className="w-4 h-4 text-amber-600" /> {apt.time}
                      </p>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex items-start gap-2 text-[13px] text-slate-600 font-medium font-inter">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-snug truncate md:whitespace-normal">{apt.location}</span>
                    </div>

                    <div className="col-span-1 md:col-span-2 hidden md:flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleDownloadReceipt(apt)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${getStatusStyle(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                    <CalendarIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2 font-outfit">No appointments found</h3>
                  <p className="text-slate-500 text-sm max-w-md font-inter leading-relaxed mb-8">
                    {searchQuery 
                      ? "We couldn't find any appointments matching your search criteria."
                      : `You don't have any ${activeTab.toLowerCase()} appointments at the moment.`}
                  </p>
                  
                  {!searchQuery && (
                    <button 
                      onClick={() => router.push('/lawyer')}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold font-inter text-sm shadow-xl hover:bg-black transition active:scale-95"
                    >
                      Find a Lawyer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
