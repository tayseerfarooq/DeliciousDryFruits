'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export function useAdminAuth() {
    const router = useRouter();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    router.push('/login');
                    return;
                }

                const data = await res.json();
                if (data.user?.role !== 'admin') {
                    router.push('/');
                    return;
                }

                setUser(data.user);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { user, loading };
}
