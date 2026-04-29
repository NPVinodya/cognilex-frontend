'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface DashboardLoadingProps {
    progress?: number;
    message?: string;
}

export default function DashboardLoading({ 
    progress = 100, 
    message = "Loading Lawyer Dashboard..." 
}: DashboardLoadingProps) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center animate-in fade-in duration-500">
            <div className="w-full max-w-md px-6">
                <p className="mb-4 text-center text-sm font-bold text-slate-700 uppercase tracking-widest">{message}</p>
                <div className="relative pt-1">
                    <Progress value={progress} className="h-2 bg-slate-100" />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Initializing</p>
                    <p className="text-sm font-black text-orange-600">{Math.round(progress)}%</p>
                </div>
            </div>
        </div>
    );
}
