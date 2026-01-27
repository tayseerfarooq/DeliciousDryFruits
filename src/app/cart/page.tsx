'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart);
            } else if (res.status === 401) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, variantId, quantity })
            });
            if (res.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = (productId: string, variantId: string) => {
        updateQuantity(productId, variantId, 0);
    };

    if (loading) {
        return (
            <div className="container py-3xl text-center">
                <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container py-3xl text-center">
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--color-text-light)', marginTop: 'var(--spacing-md)' }}>
                    Start shopping to add items to your cart
                </p>
                <button onClick={() => router.push('/products')} className="btn btn-primary mt-xl">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container py-2xl">
            <h1 style={{ marginBottom: 'var(--spacing-2xl)' }}>Shopping Cart</h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)', alignItems: 'start' }}>
                {/* Cart Items */}
                <div>
                    {cart.items.map((item: any) => (
                        <div key={`${item.productId}-${item.variantId}`} className="card" style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                                {/* Product Image */}
                                {item.product?.images?.[0] && (
                                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                        <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                )}

                                {/* Product Info */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-xs)' }}>{item.product?.name}</h3>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                                        Weight: {item.variant?.weight}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => updateQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))}
                                            style={{ width: '36px', height: '36px', padding: 0 }}
                                        >
                                            -
                                        </button>
                                        <span style={{ fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                            style={{ width: '36px', height: '36px', padding: 0 }}
                                            disabled={item.quantity >= (item.variant?.stock || 0)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => removeItem(item.productId, item.variantId)}
                                            style={{ marginLeft: 'auto', color: 'var(--color-error)' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                        ₹{item.variant?.price * item.quantity}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                        ₹{item.variant?.price} each
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="card" style={{ position: 'sticky', top: '100px', padding: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                        <span>Subtotal:</span>
                        <span style={{ fontWeight: '600' }}>₹{cart.total}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                        <span>Shipping:</span>
                        <span>{cart.total > 999 ? 'FREE' : '₹50'}</span>
                    </div>

                    <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--color-primary)' }}>
                                ₹{cart.total + (cart.total > 999 ? 0 : 50)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/checkout')}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        onClick={() => router.push('/products')}
                        className="btn btn-outline mt-md"
                        style={{ width: '100%' }}
                    >
                        Continue Shopping
                    </button>

                    {cart.total < 999 && (
                        <div style={{
                            marginTop: 'var(--spacing-md)',
                            padding: 'var(--spacing-sm)',
                            backgroundColor: 'var(--color-cream-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            Add ₹{999 - cart.total} more for free shipping!
                        </div>
                    )}
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
