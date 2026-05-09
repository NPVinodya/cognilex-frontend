'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GuestChat from '@/components/chat/GuestChat';
import LearnTheLawButton from '@/components/ui/LearnTheLawButton';
import { BookOpen, FileText, Users, Scale, Gavel, Shield, Award, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}

        <div className="relative bg-slate-900 pt-20 pb-32 lg:pt-28 lg:pb-40 overflow-hidden z-0">
          {/* Animated Legal Icons Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
            <div className="absolute top-12 left-4 md:top-20 md:left-10 animate-float">
              <Scale className="w-16 h-16 md:w-32 md:h-32 text-white" />
            </div>
            <div className="absolute top-12 right-4 md:top-20 md:right-20 animate-float-delayed">
              <Gavel className="w-16 h-16 md:w-32 md:h-32 text-white" />
            </div>
            <div className="absolute bottom-28 left-4 md:bottom-32 md:left-40 animate-float">
              <Shield className="w-16 h-16 md:w-32 md:h-32 text-white" />
            </div>
            <div className="absolute bottom-24 right-4 md:bottom-32 md:right-32 animate-pulse">
              <Award className="w-16 h-16 md:w-32 md:h-32 text-white" />
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-4 md:mb-6 border border-slate-700 shadow-sm">
              <Scale className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight">
              Your Trusted <span className="text-amber-500">Legal Assistant</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 md:mb-10 px-2 md:px-0">
              Get instant, authoritative answers to Sri Lankan law questions, backed by a comprehensive legal database.
            </p>

            <div className="flex justify-center mt-4 md:mt-6">
              <LearnTheLawButton />
            </div>
          </div>
        </div>


        {/* Chat Section */}
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 -mt-12 md:-mt-24 relative z-20 mb-20">
          <div className="relative group overflow-hidden bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/20 hover:border-white/30 transition-all duration-700">
            {/* WINDOW HEADER (No background image here) */}
            <div className="relative z-20 bg-slate-800/80 backdrop-blur-md px-5 py-4 md:px-8 md:py-5 border-b border-white/20 flex justify-between items-center">
              <div>
                <h3 className="text-base md:text-xl font-bold text-white flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 shrink-0 bg-amber-500 rounded-full animate-pulse"></div>
                  AI Legal Consultation
                </h3>
              </div>
              <div className="flex gap-1.5 md:gap-2.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
              </div>
            </div>

            {/* CONTENT AREA WITH BACKGROUND IMAGE */}
            <div className="relative">
              {/* BACKGROUND IMAGE WITH OVERLAY */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/lady_justice_bg.png"
                  alt="Legal Background"
                  className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[20s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="absolute inset-0 backdrop-blur-[1px]"></div>
              </div>

              <div className="relative z-10 p-2 md:p-4">
                <GuestChat />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Legal Answers</h3>
              <p className="text-slate-600 leading-relaxed">
                Get immediate, professional responses backed by Sri Lankan legal statutes and case law.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Source Citations</h3>
              <p className="text-slate-600 leading-relaxed">
                Every answer includes meticulously referenced citations to legal sources for your verification.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connect with Lawyers</h3>
              <p className="text-slate-600 leading-relaxed">
                Book appointments with verified, practicing lawyers across all 9 provinces in Sri Lanka.
              </p>
            </div>
          </div>

          {/* Bottom Legal Banner */}
          <div className="mt-20">
            <div className="bg-slate-900 rounded-2xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                <Scale className="w-24 h-24 text-white" />
              </div>
              <div className="absolute bottom-1 left-1 opacity-10 transform translate-x-1 -translate-y-1">
                <Scale className="w-24 h-24 text-white" />
              </div>
              <div className="absolute top-5 left-3 opacity-10 transform translate-x-1 -translate-y-1">
                <Gavel className="w-24 h-24 text-white" />
              </div>
              <div className="absolute bottom-0 right-10 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <Gavel className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <Shield className="w-12 h-12 text-amber-500 mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Comprehensive Sri Lankan Legal System Coverage</h3>
                <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
                  Built specifically for Sri Lankan law, covering all 9 provinces with a comprehensive legal database
                  including statutes, case law, and expert legal opinions from verified practitioners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}