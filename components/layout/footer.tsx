'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getChatHref } from '@/lib/user';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatHref, setChatHref] = useState('/login');

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const authed = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authed);
    };

    checkAuth();
    setChatHref(getChatHref());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Find Lawyers', path: '/appointmentFind' },
    { name: 'AI Legal Chat', path: chatHref },
    { name: 'Appointments', path: '/appointmentManage' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/legal/privacy' },
    { name: 'Terms of Service', path: '/legal/terms' },
    { name: 'Cookie Policy', path: '/legal/cookies' },
    { name: 'Lawyer Registration', path: '/lawyerRegistation' },
  ];

  const practiceAreas = [
    { name: 'Criminal Law', path: '/practice/criminal' },
    { name: 'Civil Law', path: '/practice/civil' },
    { name: 'Corporate Law', path: '/practice/corporate' },
    { name: 'Family Law', path: '/practice/family' },
    { name: 'Property Law', path: '/practice/property' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:bg-blue-700' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:bg-pink-600' },
    { name: 'Youtube', icon: Youtube, url: '#', color: 'hover:bg-red-600' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="bg-white p-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
                <Scale className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">CogniLex AI</h2>
                <p className="text-xs text-slate-400">Sri Lankan Law Assistant</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your authoritative AI-powered legal assistant for Sri Lankan law. Get instant professional guidance and connect with qualified lawyers.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <a href="tel:+94112345678" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+94 11 234 5678</span>
              </a>
              <a href="mailto:vino@cognilex.com" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">vino@cognilex.com</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="bg-white/10 p-2 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">CogniLex, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="text-white">Quick Links</span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => router.push(link.path)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-amber-400" />
                    <span className="text-sm">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="text-white">Practice Areas</span>
            </h3>
            <ul className="space-y-2">
              {practiceAreas.map((area) => (
                <li key={area.name}>
                  <button
                    onClick={() => router.push(area.path)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-amber-400" />
                    <span className="text-sm">{area.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="text-white">Stay Connected</span>
            </h3>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">Subscribe to our newsletter for legal updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-slate-400"
                />
                <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-r-lg transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-300">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => {
                        const userStr = localStorage.getItem("user");
                        const user = userStr ? JSON.parse(userStr) : null;
                        
                        if (link.name === 'Lawyer Registration') {
                          if (!isAuthenticated) {
                            router.push('/login');
                          } else if (user?.userrole === 'lawyer') {
                            router.push('/lawyerDashboard');
                          } else {
                            router.push(link.path);
                          }
                        } else {
                          router.push(link.path);
                        }
                      }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} CogniLex AI. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>in Sri Lanka</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 bg-white/10 rounded-lg hover:scale-110 transition-all duration-300 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}