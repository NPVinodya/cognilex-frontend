'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GuestChat from '@/components/chat/GuestChat';
import { BookOpen, FileText, Users, Scale, Gavel, Shield, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black relative overflow-hidden">
      {/* Animated Legal Icons Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <Scale className="w-40 h-40 text-white" />
        </div>
        <div className="absolute top-60 right-20 animate-float-delayed">
          <Gavel className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-32 left-40 animate-float">
          <Shield className="w-36 h-36 text-white" />
        </div>
        <div className="absolute bottom-60 right-32 animate-pulse">
          <Award className="w-28 h-28 text-white" />
        </div>
      </div>

      {/* Legal Document Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(255, 255, 255, 0.1) 40px,
            rgba(255, 255, 255, 0.1) 41px
          )`
        }}></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/20"></div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-5 rounded-full shadow-2xl">
                <Scale className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your Trusted Legal Assistant
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Get instant answers to Sri Lankan law questions
          </p>
          <p className="text-sm text-gray-400">
            Powered by AI • Backed by Sri Lankan Legal Database
          </p>
        </div>

        {/* Chat Section - WHITE BOX WITH CREATIVE BACKGROUND */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          {/* Outer Glow Effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -inset-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl rotate-12 opacity-20 blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl -rotate-12 opacity-20 blur-sm"></div>
          
          {/* Main White Message Box */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Top Gradient Bar with Legal Icons */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="flex items-center justify-around h-full">
                  <Scale className="w-12 h-12 text-white animate-pulse" />
                  <Gavel className="w-10 h-10 text-white animate-bounce" />
                  <Shield className="w-11 h-11 text-white animate-pulse" />
                </div>
              </div>
              <div className="relative text-center">
                <h3 className="text-2xl font-bold text-white mb-1">Ask Legal Questions</h3>
                <p className="text-blue-100 text-sm">Get AI-powered legal guidance instantly</p>
              </div>
            </div>

            {/* Side Decorative Bars */}
            <div className="absolute left-0 top-24 bottom-24 w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-r-full"></div>
            <div className="absolute right-0 top-24 bottom-24 w-2 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 rounded-l-full"></div>

            {/* White Content Area with Pattern */}
            <div className="relative bg-white p-8">
              {/* Subtle Pattern Background */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="h-full w-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>

              {/* Decorative Legal Elements */}
              <div className="absolute top-4 left-4 opacity-10">
                <Scale className="w-16 h-16 text-blue-600" />
              </div>
              <div className="absolute bottom-4 right-4 opacity-10">
                <Gavel className="w-14 h-14 text-purple-600" />
              </div>

              {/* Chat Component */}
              <div className="relative z-10">
                <GuestChat />
              </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Card 1 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 hover:border-blue-400/50 shadow-lg hover:shadow-2xl transition">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Legal Answers</h3>
              <p className="text-gray-300">
                Get immediate responses backed by Sri Lankan legal statutes and case law
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 hover:border-purple-400/50 shadow-lg hover:shadow-2xl transition">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Source Citations</h3>
              <p className="text-gray-300">
                Every answer includes direct references to legal sources for verification
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 hover:border-green-400/50 shadow-lg hover:shadow-2xl transition">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Connect with Lawyers</h3>
              <p className="text-gray-300">
                Book appointments with verified lawyers across all 9 provinces
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Banner */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-center gap-4 text-blue-400 mb-4">
              <Scale className="w-8 h-8" />
              <h3 className="text-2xl font-bold text-white">Sri Lankan Legal System</h3>
              <Gavel className="w-8 h-8" />
            </div>
            <p className="text-center text-gray-300 max-w-3xl mx-auto">
              Built specifically for Sri Lankan law, covering all 9 provinces with comprehensive legal database 
              including statutes, case law, and expert legal opinions from verified practitioners.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
      <Footer />
    </div>
  );
}