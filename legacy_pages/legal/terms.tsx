'use client';

import React, { useEffect } from 'react';
import { FileText, Scale, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function TermsOfServicePage() {
    useEffect(() => {
        const scriptId = 'dotlottie-player-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
            script.type = 'module';
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-inter selection:bg-amber-100 selection:text-amber-900 flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative bg-slate-900 pt-16 pb-12 lg:pt-20 lg:pb-16 overflow-hidden z-0">
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left flex-1 md:pr-8">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
                            >
                                Terms of <span className="text-amber-500">Service</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto md:mx-0 px-2 md:px-0"
                            >
                                Please read these terms carefully before using our platform. By accessing CogniLex, you agree to be bound by these conditions.
                            </motion.p>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex-1 flex justify-center md:justify-end w-full"
                        >
                            <div 
                                dangerouslySetInnerHTML={{
                                    __html: `
                                        <dotlottie-player
                                            src="https://assets-v2.lottiefiles.com/a/e39b4e4e-116f-11ee-ba48-375d0bd6b7d1/Lscnfmi3OM.lottie"
                                            background="transparent"
                                            speed="1"
                                            style="width: 100%; max-width: 400px; aspect-ratio: 1/1;"
                                            loop
                                            autoplay
                                        ></dotlottie-player>
                                    `
                                }}
                            />
                        </motion.div>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 -mt-20 md:-mt-32 relative z-20 pb-24 space-y-12">
                    {/* Quick Summary Grid */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        <div className="p-8 bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform min-h-[180px] flex flex-col justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Permitted Use</h3>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">Personal and professional legal research is fully supported.</p>
                        </div>
                        <div className="p-8 bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform min-h-[180px] flex flex-col justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5 border border-rose-100">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Restrictions</h3>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">Commercial resale of AI-generated content is strictly prohibited.</p>
                        </div>
                        <div className="p-8 bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform min-h-[180px] flex flex-col justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-5 border border-slate-200">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">Liability</h3>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">AI responses are for guidance only and not final legal advice.</p>
                        </div>
                    </motion.div>

                    {/* Detailed Sections */}
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-6">1. Acceptance of Terms</h2>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            By creating an account or accessing the CogniLex platform, you agree to be bound by these terms. CogniLex is an educational and legal research platform suitable for users of all ages. If you do not agree with any part of these terms, you must immediately cease use of our services.
                        </p>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-6">2. Not a Law Firm</h2>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            CogniLex provides AI-powered legal information and professional matching services. <span className="font-black text-slate-900 underline decoration-[#FF9000] decoration-2">We are not a law firm</span> and do not provide direct legal representation. The AI-generated content is intended for informational purposes and should always be verified by a qualified attorney before being relied upon for critical legal decisions.
                        </p>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">

                                3. User Conduct
                            </h2>
                            <div className="grid gap-4">
                                {[
                                    "Do not attempt to scrape or reverse engineer the AI models.",
                                    "Do not provide false information during lawyer registration.",
                                    "Respect the confidentiality of attorney-client matching.",
                                    "Do not use the platform for any illegal or harmful activities."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-white/80 rounded-2xl border border-slate-100 font-bold text-slate-600 group hover:border-[#FF9000] hover:shadow-md transition-all">
                                        <div className="w-6 h-6 rounded-full bg-slate-900 text-[#FF9000] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-md">
                                            {i + 1}
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-6">4. Intellectual Property</h2>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            All software, algorithms, designs, and content provided on CogniLex are the exclusive property of CogniLex AI Legal Systems or its licensors. You are granted a limited, non-exclusive license to use the platform for its intended purposes.
                        </p>
                    </motion.section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
