'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare, User, FileText, CheckCircle, AlertCircle, Scale, Linkedin, Facebook, Twitter, Instagram
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', details: ['+94 11 234 5678', '+94 77 123 4567'], action: 'Call us now' },
    { icon: Mail, title: 'Email', details: ['support@cognilex.lk', 'info@cognilex.lk'], action: 'Send email' },
    { icon: MapPin, title: 'Office', details: ['123 Legal Plaza, Colombo 03', 'Sri Lanka'], action: 'Get directions' },
    { icon: Clock, title: 'Working Hours', details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'], action: 'View schedule' }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: '#', hover: 'hover:bg-[#1877F2] hover:text-white' },
    { icon: Twitter, name: 'Twitter', url: '#', hover: 'hover:bg-[#1DA1F2] hover:text-white' },
    { icon: Linkedin, name: 'LinkedIn', url: '#', hover: 'hover:bg-[#0A66C2] hover:text-white' },
    { icon: Instagram, name: 'Instagram', url: '#', hover: 'hover:bg-[#E4405F] hover:text-white' }
  ];

  const subjects = ['General Inquiry', 'Legal Consultation', 'Lawyer Registration', 'Technical Support', 'Partnership', 'Feedback', 'Other'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-slate-900 py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                <MessageSquare className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-bold">We're Here to Help</span>
              </div>
              </div>


            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-slate-300">
              Have questions about our legal services? Our team is ready to assist you with any inquiries.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 border border-slate-200">
                  <info.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-sm text-slate-600 mb-1">{detail}</p>
                ))}
                <button className="mt-4 text-sm font-bold text-amber-600 hover:text-amber-700 transition">
                  {info.action} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Form & Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Send a Secure Message</h2>
                  <p className="text-slate-600 mt-2">Fill out the form below and we will respond systematically.</p>
                </div>

                {status === 'success' && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Message sent securely</p>
                      <p className="text-sm text-green-700">We will get back to you within 24 business hours.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Transmission Failed</p>
                      <p className="text-sm text-red-700">Please verify your connection and try again.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition">
                        <option value="">Select a subject</option>
                        {subjects.map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message Content *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={6}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={status === 'loading'}
                    className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {status === 'loading' ? 'Transmitting...' : <><Send className="w-5 h-5" /> Submit Message</>}
                  </button>
                  <p className="text-xs text-slate-500 text-center uppercase tracking-wide">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-slate-700" /> Platform Access
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 hover:border-amber-500 rounded-lg transition group">
                    <p className="font-bold text-slate-900 group-hover:text-amber-600 transition">Book Consultation</p>
                    <p className="text-xs text-slate-500">Schedule with our advocates</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 hover:border-amber-500 rounded-lg transition group">
                    <p className="font-bold text-slate-900 group-hover:text-amber-600 transition">AI Legal Chat</p>
                    <p className="text-xs text-slate-500">Automated legal responses</p>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 hover:border-amber-500 rounded-lg transition group">
                    <p className="font-bold text-slate-900 group-hover:text-amber-600 transition">Lawyer Directory</p>
                    <p className="text-xs text-slate-500">Find qualified practitioners</p>
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-4">Official Channels</h3>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social, idx) => (
                    <a key={idx} href={social.url} className={`p-3 bg-slate-800 rounded-lg transition text-slate-300 ${social.hover}`} title={social.name}>
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-red-900 mb-2">Urgent Matters</h3>
                <p className="text-sm text-red-700 mb-4">Immediate counsel hotline</p>
                <a href="tel:+94771234567" className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition">
                  +94 77 123 4567
                </a>
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-100 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" /> Headquarters Location
              </h3>
              <p className="text-slate-600 mt-1">123 Legal Plaza, Colombo 03, Western Province</p>
            </div>
            <div className="h-96 bg-slate-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Interactive Map Integration</p>
                <p className="text-sm text-slate-500">Coordinates: 6.9271° N, 79.8612° E</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}