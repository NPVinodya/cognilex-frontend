'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LawyerRegistrationPage from "@/legacy_pages/lawyerRegistation_page";

export default function LawyerRegistration() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user?.userrole === 'lawyer') {
            router.replace('/lawyerDashboard');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return <LawyerRegistrationPage />;
}
