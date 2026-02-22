'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import {
  Scale, Shield, Users, Target, Award, BookOpen, CheckCircle,
  Brain, Gavel, FileText, TrendingUp, MessageSquare, Lock, Globe, Lightbulb
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Lawyers', value: '500+', icon: Scale },
    { label: 'Legal Cases Resolved', value: '10,000+', icon: Gavel },
    { label: 'AI Consultations', value: '50,000+', icon: Brain },
    { label: 'Client Satisfaction', value: '98%', icon: Award }
  ];

  const values = [
    { icon: Scale, title: 'Justice & Integrity', description: 'We uphold the highest standards of legal ethics and integrity in every interaction.' },
    { icon: Brain, title: 'AI-Powered Innovation', description: 'Leveraging cutting-edge AI technology to make legal services accessible to everyone.' },
    { icon: Shield, title: 'Client Protection', description: 'Your privacy and security are our top priorities with end-to-end encryption.' },
    { icon: Users, title: 'Community Focus', description: 'Building a trusted community of legal professionals and clients across Sri Lanka.' }
  ];

  const features = [
    { icon: MessageSquare, title: 'AI Legal Assistant', description: 'Get instant answers to your legal questions powered by advanced AI trained on Sri Lankan law.' },
    { icon: Users, title: 'Verified Lawyers', description: 'Connect with thoroughly vetted and experienced lawyers across all practice areas.' },
    { icon: FileText, title: 'Document Analysis', description: 'Upload and analyze legal documents with AI-powered insights and recommendations.' },
    { icon: Lock, title: 'Secure Platform', description: 'Bank-level security ensures your sensitive legal information remains confidential.' },
    { icon: Globe, title: 'Island-Wide Coverage', description: 'Access legal services from any province in Sri Lanka, anytime, anywhere.' },
    { icon: TrendingUp, title: 'Transparent Pricing', description: 'Clear consultation fees with no hidden costs. Know what you pay upfront.' }
  ];

  const team = [
    { name: 'Legal Experts', role: 'Bar-Certified Lawyers', description: 'Over 500 registered lawyers with specialized expertise across multiple practice areas.', icon: Scale },
    { name: 'AI Researchers', role: 'Machine Learning Team', description: 'Dedicated team of AI specialists continuously improving our legal AI assistant.', icon: Brain },
    { name: 'Legal Consultants', role: 'Advisory Board', description: 'Senior legal advisors ensuring accuracy and compliance with Sri Lankan law.', icon: Gavel }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-slate-900 py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full mb-6 relative">
              <Scale className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-200">Sri Lanka's Leading Legal Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Democratizing Access to <span className="text-amber-500">Legal Excellence</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              CogniLex combines artificial intelligence with human expertise to provide
              accessible, affordable, and highly professional legal services to every citizen.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-slate-200 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 border border-slate-200 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/10 scale-0 group-hover:scale-100 transition-transform rounded-lg"></div>
                  <stat.icon className="w-6 h-6 text-amber-600 relative z-10" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-600 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bridging the Justice Gap</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We believe every person deserves access to quality legal guidance. CogniLex leverages
              advanced technology to break down barriers of cost, complexity, and accessibility in the legal system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                  <value.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-900 py-20 text-white border-t border-slate-800 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Legal Solutions</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Everything you need for your legal journey, powered by advanced technology and authoritative human expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Powered by Expertise</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A multidisciplinary team combining legal knowledge, AI innovation, and an unwavering commitment to justice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6 border border-slate-200">
                  <member.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-slate-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white border-t border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Choose CogniLex?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto">
              {([
                'AI-powered legal assistance available 24/7',
                'Thoroughly vetted and bar-certified lawyers',
                'Transparent pricing with no hidden fees',
                'Secure and confidential consultations',
                'Coverage across all provinces in Sri Lanka',
                'Multiple practice areas and specializations',
                'Fast response times and scheduling',
                'Professional platform built on modern technologies'
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-slate-800 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="px-8 py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready for Sound Legal Guidance?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of Sri Lankans who trust our authoritative platform for their professional legal needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition shadow-md">
                  Start Free Consultation
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition">
                  Browse Lawyers
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}