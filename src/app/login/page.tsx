'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/products');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-3xl">
            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                <div className="card" style={{ padding: 'var(--spacing-2xl)' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Login</h1>

                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <span className="spinner" /> : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                        Don't have an account? <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Sign up</Link>
                    </div>

                    <div style={{
                        marginTop: 'var(--spacing-xl)',
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'var(--color-cream-light)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>Test Accounts:</div>
                        <div>Admin: admin@deliciousdryfruits.com / admin123</div>
                        <div>Customer: customer@example.com / admin123</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
