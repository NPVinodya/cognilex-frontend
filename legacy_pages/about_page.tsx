'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Scale, 
  Shield, 
  Users, 
  Target, 
  Award, 
  BookOpen,
  CheckCircle,
  Brain,
  Gavel,
  FileText,
  TrendingUp,
  MessageSquare,
  Lock,
  Globe,
  Lightbulb
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Lawyers', value: '500+', icon: Scale },
    { label: 'Legal Cases Resolved', value: '10,000+', icon: Gavel },
    { label: 'AI Consultations', value: '50,000+', icon: Brain },
    { label: 'Client Satisfaction', value: '98%', icon: Award }
  ];

  const values = [
    {
      icon: Scale,
      title: 'Justice & Integrity',
      description: 'We uphold the highest standards of legal ethics and integrity in every interaction.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Innovation',
      description: 'Leveraging cutting-edge AI technology to make legal services accessible to everyone.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Client Protection',
      description: 'Your privacy and security are our top priorities with end-to-end encryption.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building a trusted community of legal professionals and clients across Sri Lanka.',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Legal Assistant',
      description: 'Get instant answers to your legal questions powered by advanced AI trained on Sri Lankan law.'
    },
    {
      icon: Users,
      title: 'Verified Lawyers',
      description: 'Connect with thoroughly vetted and experienced lawyers across all practice areas.'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI-powered insights and recommendations.'
    },
    {
      icon: Lock,
      title: 'Secure Platform',
      description: 'Bank-level security ensures your sensitive legal information remains confidential.'
    },
    {
      icon: Globe,
      title: 'Island-Wide Coverage',
      description: 'Access legal services from any province in Sri Lanka, anytime, anywhere.'
    },
    {
      icon: TrendingUp,
      title: 'Transparent Pricing',
      description: 'Clear consultation fees with no hidden costs. Know what you pay upfront.'
    }
  ];

  const team = [
    {
      name: 'Legal Experts',
      role: 'Bar-Certified Lawyers',
      description: 'Over 500 registered lawyers with specialized expertise across multiple practice areas.',
      icon: Scale,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'AI Researchers',
      role: 'Machine Learning Team',
      description: 'Dedicated team of AI specialists continuously improving our legal AI assistant.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Legal Consultants',
      role: 'Advisory Board',
      description: 'Senior legal advisors ensuring accuracy and compliance with Sri Lankan law.',
      icon: Gavel,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Scale className="w-6 h-6 text-blue-300" />
                <span className="text-sm font-bold">Sri Lanka's Leading AI Legal Platform</span>
              </div>
              
              <h1 className="text-5xl font-bold mb-4">
                Democratizing Access to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300">
                  Legal Excellence
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                CogniLex combines artificial intelligence with human expertise to provide 
                accessible, affordable, and reliable legal services to every citizen of Sri Lanka.
              </p>
            </div>
          </div>

          {/* Decorative Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-16 fill-current text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C150,80 350,80 600,50 C850,20 1050,80 1200,50 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl mb-4">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
              <Target className="w-4 h-4" />
              <span className="text-sm font-bold">Our Mission</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bridging the Justice Gap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe every person deserves access to quality legal guidance. CogniLex leverages 
              AI technology to break down barriers of cost, complexity, and accessibility in the legal system.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all group">
                <div className={`bg-gradient-to-br ${value.color} p-4 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Lightbulb className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-bold">Platform Features</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Comprehensive Legal Solutions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need for your legal journey, powered by advanced technology and human expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-3 rounded-xl inline-flex mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm font-bold">Our Team</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A multidisciplinary team combining legal knowledge, AI innovation, and commitment to justice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition`}></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                  <div className={`bg-gradient-to-br ${member.color} p-6 rounded-2xl mb-6 inline-flex`}>
                    <member.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-slate-100 to-blue-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose CogniLex?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {([
                'AI-powered legal assistance available 24/7',
                'Thoroughly vetted and bar-certified lawyers',
                'Transparent pricing with no hidden fees',
                'Secure and confidential consultations',
                'Coverage across all provinces in Sri Lanka',
                'Multiple practice areas and specializations',
                'Fast response times and scheduling',
                'User-friendly platform accessible anywhere'
              ]).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-md">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-2 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-900 font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of Sri Lankans who trust CogniLex for their legal needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Free Consultation
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                  Browse Lawyers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}