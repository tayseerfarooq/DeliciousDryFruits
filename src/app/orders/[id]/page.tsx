'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
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

    if (!order) {
        return (
            <div className="container py-3xl text-center">
                <h2>Order not found</h2>
            </div>
        );
    }

    return (
        <div className="container py-2xl">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Order #{order.orderNumber}</h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'start' }}>
                {/* Order Items */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-2xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Order Items</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{item.productName}</div>
                                        <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                                            {item.variantWeight} × {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>₹{item.total}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card mt-lg" style={{ padding: 'var(--spacing-2xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Shipping Address</h3>
                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.8' }}>
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                            {order.shippingAddress.pincode}<br />
                            Phone: {order.shippingAddress.phone}
                        </p>
                    </div>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                                    order.status === 'cancelled' ? 'badge-error' :
                                        'badge-info'
                                }`}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)' }}>
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Shipping:</span>
                                <span>₹{order.shipping}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Tax:</span>
                                <span>₹{order.tax}</span>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '2px solid var(--color-border)',
                            paddingTop: 'var(--spacing-md)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                                <span>Total:</span>
                                <span style={{ color: 'var(--color-primary)' }}>₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
