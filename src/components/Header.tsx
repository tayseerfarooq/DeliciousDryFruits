'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchUser();
        fetchCartCount();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchCartCount = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCartCount(data.cart?.items?.length || 0);
            }
        } catch (error) {
            // User might not be logged in
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setCartCount(0);
        router.push('/');
    };

    return (
        <header style={{
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            position: 'sticky',
            top: 0,
            zIndex: 'var(--z-sticky)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="container" style={{ paddingTop: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', textDecoration: 'none' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontFamily: 'var(--font-family-serif)',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: '#2563eb',
                            backgroundClip: 'text'
                        }}>
                            Delicious Dry Fruits
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav style={{ display: 'flex', gap: 'var(--spacing-xl)', alignItems: 'center' }} className="desktop-nav">
                        <Link href="/products" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Products</Link>
                        <Link href="/products?category=cat-001" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Nuts</Link>
                        <Link href="/products?category=cat-002" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Dried Fruits</Link>
                        <Link href="/products?category=cat-004" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Gifts</Link>

                        {user ? (
                            <>
                                <Link href="/cart" style={{
                                    position: 'relative',
                                    fontWeight: '600',
                                    color: 'var(--color-text)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)'
                                }}>
                                    🛒 Cart
                                    {cartCount > 0 && (
                                        <span style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'white',
                                            borderRadius: 'var(--radius-full)',
                                            padding: '2px 8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/orders" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Orders</Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Admin</Link>
                                )}
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
                                <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="mobile-menu-btn"
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="mobile-nav" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-md)',
                        marginTop: 'var(--spacing-lg)',
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--color-border)'
                    }}>
                        <Link href="/products" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Products</Link>
                        <Link href="/products?category=cat-001" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Nuts</Link>
                        <Link href="/products?category=cat-002" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Dried Fruits</Link>
                        <Link href="/products?category=cat-004" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Gifts</Link>
                        {user && (
                            <>
                                <Link href="/cart" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Cart ({cartCount})</Link>
                                <Link href="/orders" style={{ fontWeight: '600', color: 'var(--color-text)' }}>Orders</Link>
                                {user.role === 'admin' && <Link href="/admin" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Admin</Link>}
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
                            </>
                        )}
                        {!user && (
                            <>
                                <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
                                <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                    </nav>
                )}
            </div>

            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
        </header>
    );
}
