'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  User,
  Building,
  FileText,
  CheckCircle,
  AlertCircle,
  Scale,
  Linkedin,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+94 11 234 5678', '+94 77 123 4567'],
      color: 'from-blue-500 to-cyan-500',
      action: 'Call us now'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['support@cognilex.lk', 'info@cognilex.lk'],
      color: 'from-purple-500 to-pink-500',
      action: 'Send email'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['123 Legal Plaza, Colombo 03', 'Sri Lanka'],
      color: 'from-green-500 to-emerald-500',
      action: 'Get directions'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
      color: 'from-orange-500 to-amber-500',
      action: 'View schedule'
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#', color: 'hover:bg-blue-600' },
    { icon: Twitter, name: 'Twitter', url: '#', color: 'hover:bg-sky-500' },
    { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'hover:bg-blue-700' },
    { icon: Instagram, name: 'Instagram', url: '#', color: 'hover:bg-pink-600' }
  ];

  const subjects = [
    'General Inquiry',
    'Legal Consultation',
    'Lawyer Registration',
    'Technical Support',
    'Partnership Opportunity',
    'Complaint/Feedback',
    'Other'
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/50"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                <MessageSquare className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-bold">We're Here to Help</span>
              </div>

              <h1 className="text-5xl font-bold mb-4">
                Get in Touch
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Have questions about our legal services? Our team is ready to assist you with any inquiries.
              </p>
            </div>
          </div>

          {/* Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-16 fill-current text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0 C150,80 350,80 600,50 C850,20 1050,80 1200,50 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${info.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition`}></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-br ${info.color} p-3 rounded-xl inline-flex mb-4`}>
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-gray-600 mb-1">{detail}</p>
                  ))}
                  <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                    {info.action} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Form & Map */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-sm text-gray-600">Fill out the form below and we'll get back to you soon</p>
                  </div>
                </div>

                {/* Success Message */}
                {status === 'success' && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Message sent successfully!</p>
                      <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Something went wrong</p>
                      <p className="text-sm text-red-700">Please try again later.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-white"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject, idx) => (
                          <option key={idx} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar - Additional Info */}
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all group">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Book Consultation</p>
                    <p className="text-sm text-gray-600">Schedule with our lawyers</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all group">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition">AI Legal Chat</p>
                    <p className="text-sm text-gray-600">Get instant answers</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all group">
                    <p className="font-semibold text-gray-900 group-hover:text-green-600 transition">Browse Lawyers</p>
                    <p className="text-sm text-gray-600">Find legal experts</p>
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <p className="text-gray-300 text-sm mb-6">Follow us on social media for legal tips and updates</p>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      className={`flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Emergency Contact</h3>
                </div>
                <p className="text-red-100 text-sm mb-4">
                  For urgent legal matters, call our 24/7 hotline
                </p>
                <a href="tel:+94771234567" className="block text-center bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition">
                  +94 77 123 4567
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Visit Our Office
                </h3>
                <p className="text-blue-100 mt-1">123 Legal Plaza, Colombo 03, Sri Lanka</p>
              </div>
              <div className="h-96 bg-gray-200 relative">
                {/* Placeholder for Google Maps */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Map Integration</p>
                    <p className="text-sm text-gray-500">Google Maps will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}