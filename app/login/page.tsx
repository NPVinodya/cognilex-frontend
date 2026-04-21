import { Suspense } from 'react';
import Login from '@/legacy_pages/login_page';

function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <Login />
        </Suspense>
    );
}

export default LoginPage;