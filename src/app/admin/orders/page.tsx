'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface OrderItem {
    productName: string;
    variantWeight: string;
    quantity: number;
    price: number;
    total: number;
}

interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    createdAt: string;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
    const { user, loading } = useAdminAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
            const d = await res.json();
            setOrders(d.orders);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        setMessage('');
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });
            if (res.ok) {
                setMessage(`Order status updated to "${newStatus}"`);
                fetchOrders();
            } else {
                setMessage('Failed to update status');
            }
        } catch {
            setMessage('Error updating order');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

    if (loading) {
        return (
            <div className="container py-3xl" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }
    if (!user) return null;

    return (
        <div className="container py-2xl">
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Link href="/admin" style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>← Back to Dashboard</Link>
                <h1 style={{ marginTop: 'var(--spacing-xs)' }}>Order Management</h1>
            </div>

            {message && (
                <div className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', backgroundColor: 'var(--color-cream-light)' }}>
                    {message}
                </div>
            )}

            {/* Filter */}
            <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Filter:</span>
                <button className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setFilterStatus('all')}>
                    All ({orders.length})
                </button>
                {STATUS_OPTIONS.map(s => {
                    const count = orders.filter(o => o.status === s).length;
                    if (count === 0) return null;
                    return (
                        <button key={s} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setFilterStatus(s)}>
                            {s.charAt(0).toUpperCase() + s.slice(1)} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No orders found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {filteredOrders.map(order => (
                        <div key={order.id} className="card" style={{ overflow: 'hidden' }}>
                            {/* Order Header */}
                            <div style={{ padding: 'var(--spacing-lg)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>#{order.orderNumber}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'cancelled' ? 'badge-error' : 'badge-info'}`}>
                                        {order.status}
                                    </span>
                                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>₹{order.total.toLocaleString()}</div>
                                    <span style={{ fontSize: '1.2rem' }}>{expandedId === order.id ? '▲' : '▼'}</span>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === order.id && (
                                <div style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-cream-light)' }}>
                                    {/* Items */}
                                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Items</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'var(--spacing-lg)' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <th style={{ textAlign: 'left', padding: 'var(--spacing-xs)', fontSize: '0.8rem' }}>Product</th>
                                                <th style={{ textAlign: 'center', padding: 'var(--spacing-xs)', fontSize: '0.8rem' }}>Weight</th>
                                                <th style={{ textAlign: 'center', padding: 'var(--spacing-xs)', fontSize: '0.8rem' }}>Qty</th>
                                                <th style={{ textAlign: 'right', padding: 'var(--spacing-xs)', fontSize: '0.8rem' }}>Price</th>
                                                <th style={{ textAlign: 'right', padding: 'var(--spacing-xs)', fontSize: '0.8rem' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{item.productName}</td>
                                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{item.variantWeight}</td>
                                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-xs)', fontSize: '0.875rem' }}>{item.quantity}</td>
                                                    <td style={{ textAlign: 'right', padding: 'var(--spacing-xs)', fontSize: '0.875rem' }}>₹{item.price}</td>
                                                    <td style={{ textAlign: 'right', padding: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: '600' }}>₹{item.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Order Summary */}
                                    <div className="grid grid-2" style={{ gap: 'var(--spacing-lg)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Shipping Address</h3>
                                            <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                                                <div>{order.shippingAddress.street}</div>
                                                <div>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</div>
                                                <div>📞 {order.shippingAddress.phone}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Summary</h3>
                                            <div style={{ fontSize: '0.875rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>₹{order.tax}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginTop: 'var(--spacing-xs)', paddingTop: 'var(--spacing-xs)', borderTop: '1px solid var(--color-border)' }}>
                                                    <span>Total</span><span>₹{order.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Update */}
                                    <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Update Status</h3>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                            {STATUS_OPTIONS.map(s => (
                                                <button key={s}
                                                    className={`btn ${order.status === s ? 'btn-primary' : 'btn-secondary'}`}
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                                    disabled={order.status === s || updatingId === order.id}
                                                    onClick={() => handleStatusUpdate(order.id, s)}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
