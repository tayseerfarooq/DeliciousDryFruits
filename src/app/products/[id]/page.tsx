'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/models';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
            const data = await res.json();
            setProduct(data.product);
            if (data.product.variants.length > 0) {
                setSelectedVariant(data.product.variants[0].id);
            }
        }
        setLoading(false);
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        setAdding(true);
        setMessage('');

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: params.id,
                    variantId: selectedVariant,
                    quantity
                })
            });

            if (res.ok) {
                setMessage('Added to cart!');
                setTimeout(() => router.push('/cart'), 1000);
            } else {
                const data = await res.json();
                setMessage(data.error || 'Please login to add items to cart');
                if (res.status === 401) {
                    setTimeout(() => router.push('/login'), 1500);
                }
            }
        } catch (err) {
            setMessage('Error adding to cart');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-3xl text-center">
                <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-3xl text-center">
                <h2>Product not found</h2>
            </div>
        );
    }

    const variant = product.variants.find(v => v.id === selectedVariant);

    return (
        <div className="container py-2xl">
            <div className="grid grid-2" style={{ gap: 'var(--spacing-3xl)', alignItems: 'start' }}>
                {/* Product Images */}
                <div>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-cream-light)',
                        boxShadow: 'var(--shadow-xl)'
                    }}>
                        {product.images && product.images.length > 0 && (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {product.featured && (
                        <span className="badge badge-primary" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Featured Product
                        </span>
                    )}

                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>{product.name}</h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-xl)' }}>
                        {product.description}
                    </p>

                    {/* Variant Selection */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <label className="form-label">Select Weight</label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                            {product.variants.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v.id)}
                                    className={`btn ${selectedVariant === v.id ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {v.weight} - ₹{v.price}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price & Stock */}
                    {variant && (
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                                ₹{variant.price}
                            </div>
                            <div style={{ color: variant.stock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: '600' }}>
                                {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <label className="form-label">Quantity</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{ width: '48px' }}
                            >
                                -
                            </button>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button
                                className="btn btn-outline"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={variant && quantity >= variant.stock}
                                style={{ width: '48px' }}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleAddToCart}
                        disabled={adding || !variant || variant.stock === 0}
                        style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                    >
                        {adding ? <span className="spinner" /> : '🛒 Add to Cart'}
                    </button>

                    {message && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: message.includes('Error') || message.includes('login') ? '#FEE2E2' : '#D1FAE5',
                            color: message.includes('Error') || message.includes('login') ? '#991B1B' : '#065F46'
                        }}>
                            {message}
                        </div>
                    )}

                    {/* Benefits */}
                    {product.benefits && product.benefits.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-2xl)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-cream-light)', borderRadius: 'var(--radius-lg)' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>Health Benefits</h3>
                            <ul style={{ paddingLeft: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {product.benefits.map((benefit, idx) => (
                                    <li key={idx} style={{ color: 'var(--color-text-light)' }}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Nutritional Info */}
                    {product.nutritionalInfo && (
                        <div style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>Nutritional Information</h3>
                            <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                {Object.entries(product.nutritionalInfo).map(([key, value]) => value && (
                                    <div key={key}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-lighter)', textTransform: 'capitalize' }}>{key}</div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
