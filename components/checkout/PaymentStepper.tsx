"use client";

import { Check, Shield } from "lucide-react";

interface PaymentStepperProps {
  currentStep: 1 | 2 | 3;
  isDarkBg?: boolean;
}

export default function PaymentStepper({ currentStep, isDarkBg }: PaymentStepperProps) {
  const steps = [
    { id: 1, label: "Cart" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirm" }
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div 
              className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black transition-all duration-300 ${
                currentStep > step.id 
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" 
                  : currentStep === step.id
                  ? "bg-amber-600 text-white ring-4 ring-amber-50 shadow-lg shadow-amber-600/20"
                  : isDarkBg 
                    ? "bg-white/10 text-white/40 border border-white/20"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {currentStep > step.id ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.id}
            </div>
            
            {/* Step Label */}
            <span 
              className={`ml-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                currentStep >= step.id 
                  ? "text-amber-600" 
                  : isDarkBg ? "text-white/40" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className={`w-6 md:w-10 h-[1px] mx-3 md:mx-4 ${isDarkBg ? "bg-white/10" : "bg-slate-200"}`}>
                <div 
                  className={`h-full bg-amber-600 transition-all duration-500`}
                  style={{ width: currentStep > step.id ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
