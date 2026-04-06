'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GuestChat from '@/components/chat/GuestChat';
import { BookOpen, FileText, Users, Scale, Gavel, Shield, Award, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}

        <div className="relative bg-slate-900 py-20 lg:py-38 overflow-hidden z-0">
          {/* Animated Legal Icons Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 animate-float">
              <Scale className="w-32 h-32 text-white" />
            </div>
            <div className="absolute top-20 right-20 animate-float-delayed">
              <Gavel className="w-32 h-32 text-white" />
            </div>
            <div className="absolute bottom-32 left-40 animate-float">
              <Shield className="w-32 h-32 text-white" />
            </div>
            <div className="absolute bottom-32 right-50 animate-pulse">
              <Award className="w-32 h-32 text-white" />
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-6 border border-slate-700 shadow-sm">
              <Scale className="w-8 h-8 text-amber-500" />
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Your Trusted <span className="text-amber-500">Legal Assistant</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Get instant, authoritative answers to Sri Lankan law questions, backed by a comprehensive legal database.
            </p>
          </div>
        </div>


        {/* Chat Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" /> AI Legal Consultation
                </h3>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <GuestChat />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Legal Answers</h3>
              <p className="text-slate-600 leading-relaxed">
                Get immediate, professional responses backed by Sri Lankan legal statutes and case law.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Source Citations</h3>
              <p className="text-slate-600 leading-relaxed">
                Every answer includes meticulously referenced citations to legal sources for your verification.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
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