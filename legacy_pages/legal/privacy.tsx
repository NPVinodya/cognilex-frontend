'use client';

import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, Scale, Gavel, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
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
                                Privacy <span className="text-amber-500">Policy</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto md:mx-0 px-2 md:px-0"
                            >
                                Your privacy is our priority. We are committed to protecting your personal information and being transparent about how we use it.
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

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto px-6 -mt-20 md:-mt-32 relative z-20 pb-24 space-y-12">
                    
                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">1. Information We Collect</h2>
                        </div>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
                            <p>
                                At CogniLex, we collect information that helps us provide you with the best possible legal AI experience. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-4">
                                <li><span className="font-bold text-slate-900">Personal Identifiers:</span> Name, email address, and professional credentials (for lawyers).</li>
                                <li><span className="font-bold text-slate-900">Interaction Data:</span> Chat transcripts, legal queries, and AI-generated responses (for training and service improvement).</li>
                                <li><span className="font-bold text-slate-900">Usage Information:</span> Device type, IP address, and how you navigate our platform.</li>
                            </ul>
                        </div>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">2. How We Use Data</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900">Service Excellence</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">Using interaction history to refine our AI's accuracy and legal reasoning capabilities.</p>
                            </div>
                            <div className="p-6 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900">Secure Matching</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">Connecting clients with appropriate legal professionals based on expertise and location.</p>
                            </div>
                        </div>
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
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-slate-900">3. Data Retention</h2>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8">
                                We retain your data for as long as your account is active or as needed to provide you with our services. 
                                Chat histories are encrypted and stored securely to allow you to resume consultations across devices.
                            </p>
                        </div>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-center"
                    >
                        <h2 className="text-2xl font-black mb-4 text-slate-900">Contact Privacy Team</h2>
                        <p className="text-slate-600 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                            If you have questions about our privacy practices, or would like to request the deletion of your data, please reach out to our dedicated privacy office.
                        </p>
                        <a href="mailto:privacy@cognilex.ai" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-[#FF9000] hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl">
                            privacy@cognilex.ai
                        </a>
                    </motion.section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
