"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User, Mail, Phone, Calendar, Clock, ArrowLeft,
  CreditCard, ShieldCheck, Lock, Building, Smartphone,
  Wallet, CheckCircle, Loader2, Info, ArrowRight, ShieldAlert,
  Shield, Check, Globe, MapPin, Scale, AlertCircle
} from "lucide-react";
import Header from "@/components/layout/header";
import PaymentStepper from "@/components/checkout/PaymentStepper";
import Script from "next/script";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lawyerId = searchParams.get("lawyer");
  const slotId = searchParams.get("slot");

  const [lawyer, setLawyer] = useState<any>(null);
  const [slot, setSlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!lawyerId || !slotId) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Lawyer
        const lawyerRes = await fetch(`/api/lawyer/${lawyerId}`);
        const lawyerData = await lawyerRes.json();
        if (lawyerRes.ok && lawyerData.success) {
          setLawyer(lawyerData.lawyer);
        }

        // 2. Fetch Slot
        const slotRes = await fetch(`/api/lawyer/dashboard?type=slot&slotId=${slotId}&lawyerId=${lawyerId}`);
        const slotData = await slotRes.json();
        if (slotRes.ok && slotData.success) {
          setSlot(slotData.slot);
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lawyerId, slotId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsBooked(true);
    }, 2000);
  };

  const handlePayHerePayment = async () => {
    setIsProcessing(true);
    try {
      const amount = totalAmount;
      const currency = "LKR";

      const response = await fetch('/api/payment/payhere-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: slotId, amount, currency }),
      });
      const { hash } = await response.json();

      const payment = {
        sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false",
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || "1211149",
        return_url: window.location.origin + "/checkout",
        cancel_url: window.location.origin + "/checkout",
        notify_url: window.location.origin + "/api/payment/payhere-notify", 
        order_id: slotId,
        items: `Legal Consultation: ${lawyer.fullName}`,
        amount: amount.toFixed(2),
        currency: currency,
        hash: hash,
        first_name: formData.fullName.split(' ')[0] || "User",
        last_name: formData.fullName.split(' ')[1] || "CogniLex",
        email: formData.email || "info@cognilex.com",
        phone: formData.phone || "0770000000",
        address: "Colombo",
        city: "Colombo",
        country: "Sri Lanka",
        custom_1: formData.notes || ""
      };

      (window as any).payhere.onCompleted = async function onCompleted(orderId: string) {
        console.log("PayHere Payment Completed for Order ID:", orderId);
        
        // Finalize the booking immediately in the backend
        try {
          const finalizeRes = await fetch('/api/lawyer/dashboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slot_id: slotId,
              payment_details: {
                payment_id: "PAYHERE_CLIENT_" + orderId,
                amount: amount.toFixed(2),
                currency: currency,
                client_name: formData.fullName,
                client_email: formData.email,
                client_phone: formData.phone,
                client_notes: formData.notes
              }
            })
          });
          const finalizeData = await finalizeRes.json();
          console.log("Finalization Result:", finalizeData);
        } catch (err) {
          console.error("Auto-finalization failed:", err);
        }

        setIsProcessing(false);
        setIsBooked(true);
      };

      (window as any).payhere.onDismissed = function onDismissed() {
        setIsProcessing(false);
      };

      (window as any).payhere.onError = function onError(error: string) {
        setIsProcessing(false);
        console.error("PayHere Error:", error);
      };

      (window as any).payhere.startPayment(payment);
    } catch (error) {
      console.error("PayHere Initiation Error:", error);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!lawyer || !slot) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Session</h2>
            <p className="text-slate-600 mb-8">We couldn't find the appointment details. Please go back and try selecting a session again.</p>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const consultationFee = (lawyer?.consultationFee || 2500);
  const totalAmount = consultationFee + 200;

  if (currentStep === 3 || isBooked) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-emerald-50">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight font-outfit">Booking Confirmed</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed font-inter">Your legal consultation with <span className="font-bold text-slate-900">{lawyer?.fullName}</span> has been successfully scheduled.</p>
            <button onClick={() => router.push("/lawyerDashboard/dashboard")} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95 font-inter uppercase tracking-widest text-sm">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-left">
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />
      <Header />

      {/* Page Header — Always Dark */}
      <div className="pt-8 pb-32 w-full relative text-left bg-slate-900">
        <div className="absolute inset-0 mix-blend-multiply opacity-20 bg-amber-900"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-6">
          <div className="space-y-4">
            <button onClick={() => currentStep === 1 ? router.back() : setCurrentStep(1)} className="flex items-center gap-2 text-sm font-medium transition w-fit text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> {currentStep === 1 ? "Back to Profile" : "Back to Details"}
            </button>
            <h1 className="text-3xl font-bold tracking-tight font-outfit text-left text-white">
              {currentStep === 1 ? "Confirm Appointment" : "Payment Method"}
            </h1>
            <div className="pt-2 flex justify-center w-full">
              <PaymentStepper currentStep={currentStep} isDarkBg={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">

        {currentStep === 1 ? (
          /* ── STEP 1: TWO-COLUMN LAYOUT ── */
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left: Details Form */}
            <div className="lg:col-span-7">
              <div className="animate-in slide-in-from-left-4 duration-500">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200/60 overflow-hidden">
                  <div className="p-8 md:p-10 text-left">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-outfit">
                      <User className="w-6 h-6 text-amber-600" />
                      Your Details
                    </h2>
                    <form id="booking-form" onSubmit={handleNextStep} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1 font-inter">Full Name</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></div>
                            <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-slate-900 font-medium font-inter" placeholder="John Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1 font-inter">Email Address</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-slate-900 font-medium font-inter" placeholder="john@example.com" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1 font-inter">Phone Number</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18} /></div>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-slate-900 font-medium font-inter" placeholder="+94 77 123 4567" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1 font-inter">Additional Notes (Optional)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:border-transparent transition text-slate-900 resize-none font-medium font-inter text-left" placeholder="Briefly describe your legal issue..."></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 text-left">
                  <h3 className="font-bold text-slate-900 text-lg font-outfit">Booking Summary</h3>
                </div>
                <div className="p-6 space-y-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img src={lawyer.profilePhotoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-inter">{lawyer.fullName}</h4>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-wider font-inter">{lawyer.practiceAreas?.[0] || "Legal Expert"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1 font-inter">Date</p>
                      <div className="flex items-center gap-2 font-bold text-slate-900 font-inter text-sm">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        {new Date(slot.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1 font-inter">Time (30m)</p>
                      <div className="flex items-center gap-2 font-bold text-slate-900 font-inter text-sm">
                        <Clock className="w-4 h-4 text-amber-600" />
                        {slot.time}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm text-slate-600 font-medium font-inter">
                      <span>Consultation Fee</span>
                      <span className="font-bold text-slate-900">LKR {consultationFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 font-medium font-inter">
                      <span>Service Fee</span>
                      <span className="font-bold text-slate-900">LKR 200</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-inter">Total Payable</p>
                      <span className="text-2xl font-black tracking-tight font-inter text-slate-900">LKR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <button type="submit" form="booking-form" className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-[15px] active:scale-[0.98] font-inter uppercase tracking-widest">
                    <CreditCard className="w-5 h-5" />
                    Confirm &amp; Proceed to Pay
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-100 flex items-center gap-3 text-sm font-bold text-emerald-800 font-inter">
                <ShieldCheck className="text-emerald-600 shrink-0" />
                Secure Checkout with AES-256 Encryption
              </div>
            </div>
          </div>

        ) : currentStep === 2 ? (
          /* ── STEP 2: STACKED LAYOUT (CARDS TOP, 2-COL BOTTOM) ── */
          <div className="space-y-2 animate-in slide-in-from-right-4 duration-500">


            {/* BOTTOM: 2-Column Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">

              {/* LEFT: Unified Secure Payment (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-transparent rounded-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden text-left relative min-h-[460px]">
                  {/* Premium Atmospheric Glow Background - Lightened */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-white/85 backdrop-blur-xl z-10"></div>
                    <img 
                      src="/payment-bg.png" 
                      alt="" 
                      className="w-full h-full object-cover opacity-35 blur-3xl scale-125"
                    />
                  </div>
                  
                  <div className="p-8 md:p-12 relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-amber-600/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                      <ShieldCheck size={32} className="text-amber-600" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-2 font-outfit uppercase tracking-tight">Secure Checkout</h2>
                    <p className="text-slate-500 text-[13px] max-w-sm mb-4 leading-relaxed font-inter">
                      Pay securely via <span className="text-slate-900 font-bold">Credit/Debit Cards</span>, 
                      <span className="text-slate-900 font-bold ml-1">Mobile Wallets</span> (Frimi, Genie, iPay), 
                      or <span className="text-slate-900 font-bold ml-1">Internet Banking</span>.
                    </p>

                    {/* Integrated 3D Stacked Cards (Scaled for internal box) */}
                    <div className="flex justify-center items-center h-48 group cursor-pointer overflow-visible scale-90 mb-6">
                      <div className="relative w-[320px] h-[200px] overflow-visible" style={{ perspective: "800px" }}>
                        {/* Back card */}
                        <div className="absolute inset-0 w-[300px] h-[180px] rounded-2xl border border-slate-300/30 transition-all duration-700 group-hover:-translate-y-7"
                          style={{ transform: "rotateX(22deg) rotateZ(-4deg) translate(-4px, -24px)", background: "linear-gradient(135deg, rgba(30,35,60,0.85) 0%, rgba(50,55,80,0.65) 100%)", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}>
                          <div className="p-5 h-full flex flex-col justify-between">
                            <span className="text-white/50 text-[11px] font-black tracking-[0.2em] font-inter italic">VISA</span>
                            <div>
                              <p className="text-white/25 text-[11px] font-inter tracking-[0.18em]">4455  5491  6118  6164</p>
                              <p className="text-white/15 text-[9px] font-inter mt-1">Cardholder</p>
                            </div>
                          </div>
                        </div>
                        {/* Middle card */}
                        <div className="absolute inset-0 w-[300px] h-[180px] rounded-2xl border border-purple-300/30 transition-all duration-700 group-hover:-translate-y-2"
                          style={{ transform: "rotateX(22deg) rotateZ(-4deg) translate(-10px, -2px)", background: "linear-gradient(135deg, rgba(120,110,210,0.55) 0%, rgba(90,80,195,0.4) 50%, rgba(150,140,240,0.45) 100%)", backdropFilter: "blur(24px)", boxShadow: "0 20px 50px rgba(80,70,180,0.12)" }}>
                          <div className="p-5 h-full flex flex-col justify-between">
                            <span className="text-white/75 text-[11px] font-black tracking-[0.2em] font-inter italic">VISA</span>
                            <div>
                              <p className="text-white/60 text-[11px] font-inter tracking-[0.18em]">4455  5491  6118  6164</p>
                              <p className="text-white/35 text-[9px] font-inter mt-1">Edward Hunt</p>
                            </div>
                          </div>
                        </div>
                        {/* Front card */}
                        <div className="absolute inset-0 w-[300px] h-[180px] rounded-2xl border border-pink-300/25 transition-all duration-700 group-hover:translate-y-3"
                          style={{ transform: "rotateX(22deg) rotateZ(-4deg) translate(-16px, 20px)", background: "linear-gradient(135deg, rgba(170,130,220,0.6) 0%, rgba(210,90,175,0.5) 50%, rgba(235,130,95,0.55) 100%)", backdropFilter: "blur(24px)", boxShadow: "0 25px 55px rgba(180,100,200,0.1)" }}>
                          <div className="p-5 h-full flex flex-col justify-between">
                            <div className="flex -space-x-2 w-fit">
                              <div className="w-7 h-7 rounded-full bg-[#EB001B]/90"></div>
                              <div className="w-7 h-7 rounded-full bg-[#F79E1B]/90"></div>
                            </div>
                            <div>
                              <p className="text-white/80 text-[12px] font-inter font-semibold tracking-[0.18em]">4455  5491  6118  6164</p>
                              <p className="text-white/50 text-[9px] font-inter mt-1">Edward Hunt</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-6">
                      <button 
                        onClick={handlePayHerePayment} 
                        disabled={isProcessing} 
                        className="group relative w-full h-[50px] bg-[#121212] hover:bg-black text-white rounded-full font-semibold border border-amber-500/30 hover:border-amber-500 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all active:scale-[0.98] disabled:opacity-70 font-inter text-[15.5px] flex items-center justify-center overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                         {isProcessing ? (
                           <><Loader2 className="w-5 h-5 animate-spin" /><span className="animate-pulse tracking-wide">Securing connection...</span></>
                         ) : (
                           <span className="tracking-tight">Confirm & Pay LKR {totalAmount.toLocaleString()}</span>
                         )}
                      </button>

                      {/* Trust Icons Grid — Matching the Image */}
                      <div className="flex flex-wrap justify-center items-center gap-8 pt-12 px-4">
                        {/* VISA - Robust Icon */}
                        <div className="flex items-center gap-1.5 opacity-90 transition-all hover:scale-110">
                           <div className="w-11 h-7 bg-[#1A1F71] rounded-sm flex items-center justify-center p-1 shadow-sm">
                             <span className="text-white text-[10px] font-black italic tracking-tighter">VISA</span>
                           </div>
                           <div className="w-2.5 h-1.5 bg-[#F7B600] rounded-tr-[50%] rounded-bl-[50%] -ml-1"></div>
                        </div>

                        {/* Mastercard */}
                        <div className="flex flex-col items-center gap-0.5 opacity-100 transition-all hover:scale-110">
                           <div className="flex -space-x-1.5">
                             <div className="w-5 h-5 rounded-full bg-[#EB001B]"></div>
                             <div className="w-5 h-5 rounded-full bg-[#F79E1B]/90"></div>
                           </div>
                           <span className="text-[7px] font-bold text-slate-400 font-inter uppercase">mastercard</span>
                        </div>

                        {/* PCI DSS */}
                        <div className="flex items-center gap-1.5 opacity-90">
                           <div className="h-6 px-2.5 bg-slate-100/50 border border-slate-200 rounded-md flex items-center gap-1">
                             <span className="text-slate-800 font-black text-[9px] font-inter">PCI</span>
                             <Check className="w-3 h-3 text-emerald-500 stroke-[4]" />
                             <span className="text-slate-500 font-bold text-[8px] font-inter">DSS</span>
                           </div>
                        </div>

                        {/* Shields */}
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-8 opacity-60">
                           <ShieldCheck className="w-5 h-5 text-slate-500" />
                           <div className="w-[1px] h-4 bg-slate-200"></div>
                           <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle bottom info bar */}
                  <div className="bg-slate-50/80 backdrop-blur-sm px-8 py-3 flex items-center justify-center gap-2 border-t border-slate-100">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-inter">End-to-End Encrypted Transaction</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Booking Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-left">
                    <h3 className="font-bold text-slate-900 text-lg font-outfit">Booking Summary</h3>
                    <div className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Secure Mode</div>
                  </div>
                  <div className="p-6 space-y-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={lawyer.profilePhotoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 font-inter">{lawyer.fullName}</h4>
                        <p className="text-xs text-amber-600 font-bold uppercase tracking-wider font-inter">{lawyer.practiceAreas?.[0] || "Legal Expert"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1 font-inter">Date</p>
                        <div className="flex items-center gap-2 font-bold text-slate-900 font-inter text-sm">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          {new Date(slot.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1 font-inter">Time (30m)</p>
                        <div className="flex items-center gap-2 font-bold text-slate-900 font-inter text-sm">
                          <Clock className="w-4 h-4 text-amber-600" />
                          {slot.time}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between text-sm text-slate-600 font-medium font-inter">
                        <span>Consultation Fee</span>
                        <span className="font-bold text-slate-900">LKR {consultationFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 font-medium font-inter">
                        <span>Service Fee</span>
                        <span className="font-bold text-slate-900">LKR 200</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-inter">Total Payable</p>
                        <span className="text-2xl font-black tracking-tight font-inter text-amber-600">LKR {totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                      <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0"><ShieldCheck size={18} /></div>
                      <p className="text-[11px] text-slate-500 leading-snug font-medium font-inter">CogniLex Escrow Protection is active. Funds are held securely until your session is confirmed.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


        ) : (
          /* ── STEP 3: SUCCESS ── */
          /* ── STEP 3: SUCCESS ── */
          <div className="max-w-2xl mx-auto py-12 px-4 relative">
            {/* Celebratory Background Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-20"></div>
               <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-bounce opacity-20 duration-1000"></div>
               <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-20"></div>
            </div>

            <div className="bg-white/85 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden relative p-8 md:p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
               {/* Underlay glow from Step 2 for continuity */}
               <div className="absolute inset-0 z-0 opacity-20 blur-3xl scale-125">
                 <img src="/payment-bg.png" alt="" className="w-full h-full object-cover" />
               </div>

               <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-emerald-500/10">
                    <CheckCircle className="w-10 h-10 text-emerald-500 animate-in spin-in-1 duration-700" />
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 mb-3 font-outfit uppercase tracking-tight">Booking Confirmed!</h2>
                  <p className="text-slate-500 text-sm max-w-md mb-10 leading-relaxed font-inter">
                    Your legal consultation with <span className="font-bold text-slate-900">{lawyer.fullName}</span> has been successfully scheduled. A confirmation has been sent to your email.
                  </p>

                  <div className="w-full bg-slate-50/50 rounded-3xl border border-slate-100 p-8 mb-10 space-y-4 text-left">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center"><Calendar className="w-4 h-4 text-amber-600" /></div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</span>
                       </div>
                       <span className="font-bold text-slate-900 font-inter">{new Date(slot.date).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Slot</span>
                       </div>
                       <span className="font-bold text-slate-900 font-inter">{slot.time}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Status</span>
                       <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Verified & Paid</span>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push("/")} 
                    className="group relative w-full h-[56px] bg-[#121212] hover:bg-black text-white rounded-full font-bold border border-amber-500/30 hover:border-amber-500 shadow-xl transition-all active:scale-[0.98] font-inter text-[16px] flex items-center justify-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    GO TO DASHBOARD
                  </button>

                  <p className="mt-8 text-[11px] text-slate-400 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Secure Transaction Recorded via PayHere
                  </p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

