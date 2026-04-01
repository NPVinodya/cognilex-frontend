"use client";

import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#11131A] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Luxurious Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF9000]/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* Premium Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mx-auto px-4 lg:px-12">

        {/* Left Side: Deep Legal Typography */}
        <div className="flex-1 text-center lg:text-left">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#FF9000]/30 text-[#FF9000] text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(255,144,0,0.1)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF9000] animate-pulse"></span>
            System Error 404
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-bold tracking-tight text-white mb-6 leading-[1.05]">
            The record could <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9000] to-[#FFCC80] drop-shadow-sm">not be retrieved.</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium tracking-wide">
            The legal brief, case file, or page you are looking for has been reclassified, deleted, or you might not have the correct authorization to view it.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/"
              className="group relative px-8 py-4 bg-[#FF9000] text-[#11131A] rounded-xl font-bold text-base overflow-hidden transition-all hover:bg-[#FFB74D] hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,144,0,0.3)] hover:shadow-[0_8px_40px_rgba(255,144,0,0.4)] flex items-center justify-center gap-3"
            >
              <Scale className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Return to Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-xl font-bold text-base transition-all backdrop-blur-md flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Previous Page</span>
            </button>
          </div>
        </div>

        {/* Right Side Empty Space for Layout Integrity */}
        <div className="hidden lg:flex justify-center items-center relative w-[450px]">
          {/* Faint massive 404 as a background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] text-[280px] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter">
            404
          </div>
        </div>

      </div>

      {/* Sophisticated footer */}
      <div className="absolute bottom-8 text-center w-full pointer-events-none">
        <p className="text-xs font-bold text-slate-600 tracking-[0.2em] uppercase">
          CogniLex • AI Legal Intelligence
        </p>
      </div>

    </div>
  );
}
