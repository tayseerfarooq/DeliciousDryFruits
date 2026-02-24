'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminDashboard() {
    const { user, loading } = useAdminAuth();
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        const [productsRes, ordersRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/admin/orders')
        ]);

        if (productsRes.ok && ordersRes.ok) {
            const products = await productsRes.json();
            const ordersData = await ordersRes.json();

            const revenue = ordersData.orders.reduce((sum: number, o: any) => sum + o.total, 0);
            setStats({
                products: products.products.length,
                orders: ordersData.orders.length,
                revenue
            });
            setOrders(ordersData.orders.slice(0, 5));
        }
    };

    if (loading) {
        return (
            <div className="container py-3xl" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
                <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-light)' }}>Verifying admin access...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container py-2xl">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    Welcome, <strong>{user.name}</strong>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                <div className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{stats.products}</div>
                    <div style={{ color: 'var(--color-text-light)' }}>Total Products</div>
                </div>
                <div className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{stats.orders}</div>
                    <div style={{ color: 'var(--color-text-light)' }}>Total Orders</div>
                </div>
                <div className="card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>₹{stats.revenue.toLocaleString()}</div>
                    <div style={{ color: 'var(--color-text-light)' }}>Total Revenue</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <Link href="/admin/products" className="btn btn-primary">Manage Products</Link>
                    <Link href="/admin/orders" className="btn btn-secondary">View All Orders</Link>
                    <Link href="/admin/categories" className="btn btn-secondary">Manage Categories</Link>
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Orders</h2>
                {orders.length === 0 ? (
                    <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                        No orders yet
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {orders.map(order => (
                            <div key={order.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>Order #{order.orderNumber}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                        <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                            order.status === 'cancelled' ? 'badge-error' :
                                                'badge-info'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <div style={{ fontWeight: '700', color: 'var(--color-primary)' }}>₹{order.total}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
