'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Scale, EyeOff, Sword } from 'lucide-react';

interface LadyJusticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LadyJusticeModal: React.FC<LadyJusticeModalProps> = ({ isOpen, onClose }) => {
  const points = [
    {
      title: "The Scales (Balance)",
      description: "The scales represent the objective weighing of evidence and arguments. In the pursuit of justice, every claim must be balanced with precision, ensuring that the final judgment is rooted solely in the weight of truth and fair play.",
      icon: <Scale className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "The Blindfold (Impartiality)",
      description: "The blindfold signifies that the law is blind to social status, wealth, and power. It embodies the principle of objectivity ensuring that justice is administered without prejudice or favor, focusing only on the merits of the case.",
      icon: <EyeOff className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "The Sword (Authority)",
      description: "The sword symbolizes the power of the law to enforce its mandates. It represents that justice is not merely an ideal, but a decisive force capable of protecting rights and delivering swift, final consequences to those who violate the law.",
      icon: <Sword className="w-5 h-5 text-slate-300" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] w-[95vw] md:w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-[#f1f3f5] border-none rounded-2xl shadow-2xl focus:outline-none gap-0">
        <div className="flex flex-col md:flex-row h-full overflow-y-auto max-h-[90vh]">

          {/* Left Side: Marble Image */}
          <div className="md:w-[42%] relative bg-white min-h-[200px] sm:min-h-[250px] md:min-h-full shrink-0">
            <img
              src="/lady_justice_marble.png"
              alt="Lady Justice"
              className="absolute inset-0 w-full h-full object-cover object-top md:object-center"
            />
          </div>

          {/* Right Side: Content Area */}
          <div className="md:w-[58%] p-5 sm:p-8 md:p-10 flex flex-col justify-between">

            <div className="flex flex-col">
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  The Spirit of Justice
                </h2>
                <p className="text-slate-600 text-sm md:text-[15px]">
                  Understanding the foundation of our legal system.
                </p>
              </div>

              {/* Vertical Points */}
              <div className="space-y-4 md:space-y-6">
                {points.map((point, index) => (
                  <div key={index} className="flex gap-3 md:gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-md border border-slate-700">
                      {point.icon}
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 leading-none">
                        {point.title}
                      </h3>
                      <p className="text-slate-700 leading-snug text-[13px] md:text-sm">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Area */}
            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <p className="text-slate-600 italic text-[11px] md:text-xs font-medium text-center sm:text-left">
                Serving Sri Lankans through legal clarity and literacy.
              </p>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-amber-500 font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors border border-slate-700 shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LadyJusticeModal;
