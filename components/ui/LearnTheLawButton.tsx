'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import LadyJusticeModal from '@/components/modals/LadyJusticeModal';

interface LearnTheLawButtonProps {
  className?: string;
}

const LearnTheLawButton: React.FC<LearnTheLawButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-800 text-amber-500 font-bold rounded-full border border-amber-500/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-amber-500/10 cursor-pointer ${className}`}
      >
        <Info className="w-4 h-4" />
        <span className="text-sm tracking-wide font-medium">The Spirit of Justice</span>
      </button>

      <LadyJusticeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default LearnTheLawButton;
