'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard, Lock, ShieldCheck, ArrowLeft, Building,
  Smartphone, Wallet, CheckCircle, Loader2, Info
} from 'lucide-react';
import Header from '@/components/layout/header';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amountParam = searchParams.get('amount');
  const lawyerId = searchParams.get('lawyer');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank' | 'mobile'>('card');

  // Parse amount from URL, fallback to 2700 if missing
  const amount = amountParam ? parseInt(amountParam, 10) : 2700;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Redirect to dashboard or success page after 2 seconds
      setTimeout(() => {
        router.push('/lawyerDashboard/dashboard'); // Or another appropriate success route
      }, 2000);

    }, 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-in zoom-in-50 duration-500">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful</h2>
          <p className="text-slate-600 font-medium mb-8">Your appointment is confirmed. Redirecting to your dashboard...</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[progress_1.5s_ease-in-out_forwards]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <Header />

      {/* Background styling for premium look */}
      <div className="absolute top-0 w-full h-80 bg-[#181B25] -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-slate-900/40 mix-blend-multiply pointer-events-none"></div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 mt-8 text-left">

        <button onClick={() => router.back()} className="text-slate-300 hover:text-white mb-8 flex items-center gap-2 text-sm font-bold transition w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Checkout
        </button>

        <div className="grid lg:grid-cols-12 gap-8 items-start text-left">

          {/* Left Column - Payment Details & Form */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 text-shadow-sm text-left">Select Payment Method</h1>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-left">

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-100 bg-slate-50/50 p-2 gap-2 text-left">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${paymentMethod === 'card' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-200' : 'text-slate-500 hover:bg-slate-100/50 border border-transparent'}`}
                >
                  <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className={`text-xs font-black uppercase tracking-wide ${paymentMethod === 'card' ? 'text-slate-900' : 'text-slate-500'}`}>Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${paymentMethod === 'paypal' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-200' : 'text-slate-500 hover:bg-slate-100/50 border border-transparent'}`}
                >
                  <svg className="w-6 h-6 mb-2 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .633-.539h5.422c1.767 0 3.03.354 3.82 1.076.792.73 1.135 1.765.94 3.065-.308 2.055-1.545 3.39-3.4 3.791-.703.153-1.503.23-2.387.23H8.38a.641.641 0 0 0-.634.542l0 .001-1.419 9A.641.641 0 0 1 5.694 21.337H7.076z" />
                    <path opacity="0.5" d="M10.153 21.337H5.694a.641.641 0 0 1-.634-.74L7.54 5.923h1.745l-2.091 13.25a.641.641 0 0 0 .634.741h3.32a.641.641 0 0 0 .634-.542l.628-3.98A.641.641 0 0 1 13.044 14.6h.478c1.855 0 3.092-1.336 3.4-3.791.195-1.3-.148-2.335-.94-3.065.176.432.254.918.2 1.481-.403 2.684-1.996 4.316-4.597 4.706-.55.083-1.15.123-1.84.123h-2.1a.641.641 0 0 0-.634.54l-1.42 9.006a.641.641 0 0 1-.634.54z" />
                  </svg>
                  <span className={`text-xs font-black uppercase tracking-wide ${paymentMethod === 'paypal' ? 'text-slate-900' : 'text-slate-500'}`}>PayPal</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${paymentMethod === 'bank' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-200' : 'text-slate-500 hover:bg-slate-100/50 border border-transparent'}`}
                >
                  <Building className={`w-6 h-6 mb-2 ${paymentMethod === 'bank' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className={`text-xs font-black uppercase tracking-wide ${paymentMethod === 'bank' ? 'text-slate-900' : 'text-slate-500'}`}>Transfer</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${paymentMethod === 'mobile' ? 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-200' : 'text-slate-500 hover:bg-slate-100/50 border border-transparent'}`}
                >
                  <Smartphone className={`w-6 h-6 mb-2 ${paymentMethod === 'mobile' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className={`text-xs font-black uppercase tracking-wide ${paymentMethod === 'mobile' ? 'text-slate-900' : 'text-slate-500'}`}>Mobile</span>
                </button>
              </div>

              <div className="p-8 md:p-10 text-left">
                {paymentMethod === 'card' && (
                  <form onSubmit={handlePayment} className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1 block">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. JOHN DOE"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent transition text-slate-900 font-bold uppercase placeholder:normal-case placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
                        <span>Card Number</span>
                        <div className="flex gap-1.5 grayscale opacity-60">
                          <div className="w-8 h-5 bg-amber-100 rounded text-[9px] font-black text-amber-800 flex items-center justify-center tracking-tighter italic">VISA</div>
                          <div className="w-8 h-5 bg-orange-100 rounded text-[9px] font-black text-orange-800 flex items-center justify-center tracking-tighter">MC</div>
                        </div>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent transition text-slate-900 font-bold tracking-wide placeholder:tracking-normal placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1 block text-left">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent transition text-slate-900 font-bold text-center placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                          CVV/CVC <Info className="w-4 h-4 text-slate-400" />
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white focus:border-transparent transition text-slate-900 font-bold tracking-widest text-center placeholder:tracking-normal placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-black shadow-[0_8px_25px_-8px_rgba(245,158,11,0.5)] focus:ring-4 focus:ring-amber-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing Securely...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 opacity-80" />
                            Pay LKR {amount.toLocaleString()}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 mb-6 drop-shadow-sm">
                      <svg className="w-full h-full text-[#00457C]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .633-.539h5.422c1.767 0 3.03.354 3.82 1.076.792.73 1.135 1.765.94 3.065-.308 2.055-1.545 3.39-3.4 3.791-.703.153-1.503.23-2.387.23H8.38a.641.641 0 0 0-.634.542l0 .001-1.419 9A.641.641 0 0 1 5.694 21.337H7.076z" />
                        <path opacity="0.5" d="M10.153 21.337H5.694a.641.641 0 0 1-.634-.74L7.54 5.923h1.745l-2.091 13.25a.641.641 0 0 0 .634.741h3.32a.641.641 0 0 0 .634-.542l.628-3.98A.641.641 0 0 1 13.044 14.6h.478c1.855 0 3.092-1.336 3.4-3.791.195-1.3-.148-2.335-.94-3.065.176.432.254.918.2 1.481-.403 2.684-1.996 4.316-4.597 4.706-.55.083-1.15.123-1.84.123h-2.1a.641.641 0 0 0-.634.54l-1.42 9.006a.641.641 0 0 1-.634.54z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pay with PayPal</h3>
                    <p className="text-slate-500 max-w-xs mb-8 font-medium">
                      You will be redirected to PayPal to complete your purchase securely. You can pay with your credit card if you don't have a PayPal account.
                    </p>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full max-w-xs h-12 bg-[#FFC439] hover:bg-[#F4BB33] text-[#002B36] rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading ? <Loader2 size={24} className="animate-spin" /> : 'Proceed to PayPal'}
                    </button>
                  </div>
                )}

                {(paymentMethod === 'bank' || paymentMethod === 'mobile') && (
                  <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      {paymentMethod === 'bank' ? <Building size={32} className="text-slate-400" /> : <Smartphone size={32} className="text-slate-400" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {paymentMethod === 'bank' ? 'Bank Transfer Selected' : 'Mobile Wallet Selected'}
                    </h3>
                    <p className="text-slate-500 max-w-xs mb-8 font-medium">
                      {paymentMethod === 'bank'
                        ? 'You will be redirected to our secure bank transfer portal to complete your transaction.'
                        : 'You will receive a prompt on your mobile device to authorize this payment.'}
                    </p>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="px-8 h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Selection'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Widget */}
          <div className="lg:col-span-12 xl:col-span-5 h-full lg:pt-16">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden sticky top-8 text-left">
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/20 rounded-full blur-2xl"></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Summary</h3>
                <div className="flex justify-between items-end">
                  <span className="text-slate-300 font-medium">Total Payable</span>
                  <span className="text-4xl font-black tracking-tight underline decoration-amber-500/50 underline-offset-8 decoration-4">LKR {amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-8 space-y-8 text-left">
                <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">CogniLex Escrow Protection</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Your funds are held securely. The lawyer is paid only after your consultation is complete.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-emerald-800 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                  <p>100% Secure SSL Transaction</p>
                </div>

                <div className="flex items-center justify-center gap-4 opacity-40 grayscale pt-2">
                  <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-600">PCI</div>
                  <div className="h-6 w-10 bg-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-600">DSS</div>
                  <div className="h-10 w-24 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="text-[10px] font-black text-slate-400 italic">SECURE PAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
