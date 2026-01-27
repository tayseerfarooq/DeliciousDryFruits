'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-3xl text-center">
                <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }

    return (
        <div className="container py-2xl">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-3xl">
                    <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}>No orders yet</p>
                    <Link href="/products" className="btn btn-primary mt-xl">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {orders.map(order => (
                        <Link key={order.id} href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>Order #{order.orderNumber}</div>
                                        <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                            order.status === 'cancelled' ? 'badge-error' :
                                                'badge-info'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ color: 'var(--color-text-light)' }}>
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                        ₹{order.total}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
