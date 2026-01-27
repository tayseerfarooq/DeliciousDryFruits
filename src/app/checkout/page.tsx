'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
        loadRazorpay();
    }, []);

    const loadRazorpay = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    };

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                if (!data.cart || data.cart.items.length === 0) {
                    router.push('/cart');
                } else {
                    setCart(data.cart);
                }
            } else if (res.status === 401) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            // Create order
            const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingAddress: { ...address, country: 'India' } })
            });

            if (!checkoutRes.ok) {
                const data = await checkoutRes.json();
                setError(data.error || 'Checkout failed');
                setProcessing(false);
                return;
            }

            const checkoutData = await checkoutRes.json();

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: checkoutData.razorpayOrder.amount,
                currency: checkoutData.razorpayOrder.currency,
                name: 'Delicious Dry Fruits',
                description: 'Premium Dry Fruits & Nuts',
                order_id: checkoutData.razorpayOrder.id,
                handler: async function (response: any) {
                    // Verify payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: checkoutData.order.id
                        })
                    });

                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        router.push(`/orders/${verifyData.order.id}`);
                    } else {
                        setError('Payment verification failed');
                        setProcessing(false);
                    }
                },
                prefill: {
                    contact: address.phone
                },
                theme: {
                    color: '#D97706'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function () {
                setError('Payment failed. Please try again.');
                setProcessing(false);
            });
            rzp.open();
        } catch (err) {
            setError('An error occurred. Please try again.');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-3xl text-center">
                <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }

    if (!cart) return null;

    const subtotal = cart.total;
    const shipping = subtotal > 999 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    return (
        <div className="container py-2xl">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>Checkout</h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'start' }}>
                {/* Shipping Form */}
                <div>
                    <div className="card" style={{ padding: 'var(--spacing-2xl)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Shipping Address</h2>

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
                                <label className="form-label">Street Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    required
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        required
                                        placeholder="Mumbai"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        required
                                        placeholder="Maharashtra"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label className="form-label">Pincode</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={address.pincode}
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        required
                                        placeholder="400001"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                        required
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={processing}>
                                {processing ? <span className="spinner" /> : 'Proceed to Payment'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card" style={{ position: 'sticky', top: '100px', padding: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal:</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Shipping:</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Tax (5%):</span>
                            <span>₹{tax}</span>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '2px solid var(--color-border)',
                        paddingTop: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--color-primary)' }}>₹{total}</span>
                        </div>
                    </div>

                    <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'var(--color-cream-light)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>🔒 Secure Payment</div>
                        <div style={{ color: 'var(--color-text-light)' }}>
                            Your payment information is encrypted and secure
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
