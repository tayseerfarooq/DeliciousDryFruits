'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/models';

interface ProductCardProps {
    product: Product;
    initialQuantity?: number;
}

export default function ProductCard({ product, initialQuantity = 0 }: ProductCardProps) {
    const [loading, setLoading] = useState(false);
    // Local quantity state for optimistic UI. 
    const [quantity, setQuantity] = useState(initialQuantity);

    // Sync state if prop changes (e.g. on re-fetch from parent)
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const minPrice = Math.min(...product.variants.map(v => v.price));
    const maxPrice = Math.max(...product.variants.map(v => v.price));
    const priceDisplay = minPrice === maxPrice
        ? `₹${minPrice}`
        : `₹${minPrice} - ₹${maxPrice}`;

    const updateCart = async (newQty: number) => {
        if (loading) return;
        setLoading(true);

        // Optimistic update
        setQuantity(newQty);

        try {
            const defaultVariant = product.variants[0];
            const endpoint = '/api/cart';
            let method = 'POST';
            let body = {};

            // Determine API action based on diff? 
            // The existing API has POST (add) and PUT (update/set).
            // PUT /api/cart expects { productId, variantId, quantity }.
            // This sets absolute quantity. Perfect for our counter.

            method = 'PUT';
            body = {
                productId: product.id,
                variantId: defaultVariant.id,
                quantity: newQty
            };

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                window.dispatchEvent(new Event('cart-updated'));
            } else {
                if (res.status === 401) {
                    window.location.href = '/login';
                } else {
                    // Revert on error
                    console.error('Update failed');
                    // We might want to fetch actual cart state here to sync
                }
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateCart(quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity > 0) {
            updateCart(quantity - 1);
        }
    };

    return (
        <div className="card card-product" style={{ position: 'relative' }}>
            <div className="card-product-image" style={{ position: 'relative' }}>
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'var(--color-cream-light)', color: 'var(--color-text-lighter)'
                        }}>
                            No Image
                        </div>
                    )}
                </Link>

                {product.featured && (
                    <span style={{
                        position: 'absolute', top: 'var(--spacing-sm)', right: 'var(--spacing-sm)',
                        backgroundColor: 'var(--color-accent)', color: 'var(--color-brown-100)',
                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px',
                        pointerEvents: 'none', zIndex: 1
                    }}>
                        Featured
                    </span>
                )}

                {/* Quick Add Controls - Sibling to Link */}
                <div className="quick-add-container">
                    {quantity === 0 ? (
                        <button
                            onClick={handleIncrement}
                            className="btn-quick-add"
                            title="Add to Cart"
                            type="button"
                        >
                            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>+</span>
                        </button>
                    ) : (
                        <div className="qty-control">
                            <button onClick={handleDecrement} className="qty-btn minus">-</button>
                            <span className="qty-text">{quantity}</span>
                            <button onClick={handleIncrement} className="qty-btn plus">+</button>
                        </div>
                    )}
                </div>
            </div>

            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block', flex: 1 }}>
                <div className="card-product-content">
                    <h3 className="card-product-title">{product.name}</h3>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', flex: 1 }}>
                        {product.shortDescription}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <div className="card-product-price">{priceDisplay}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-lighter)', textTransform: 'uppercase', fontWeight: '600' }}>
                            {product.variants.length} size{product.variants.length > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </Link>

            <style jsx>{`
                .card-product {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .card-product-image {
                    position: relative;
                }
                
                .quick-add-container {
                    position: absolute;
                    bottom: var(--spacing-sm);
                    right: var(--spacing-sm);
                    z-index: 20;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.2s ease-in-out;
                }

                .card-product-image:hover .quick-add-container,
                .quick-add-container:hover,
                .quick-add-container:focus-within {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* If quantity > 0, make it visible always? 
                   User requirement: "button must not always be visibe it must be visible only when the cursor is on it"
                   So we keep opacity: 0 logic even if qty > 0.
                */
                
                .btn-quick-add {
                    padding: 0;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    background-color: var(--color-primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-quick-add:hover {
                    background-color: var(--color-primary-dark);
                    transform: scale(1.1);
                }

                .qty-control {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 20px; /* Pill shape */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    overflow: hidden;
                    height: 40px;
                }
                .qty-btn {
                    width: 32px;
                    height: 100%;
                    border: none;
                    background-color: var(--color-primary);
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .qty-btn:hover {
                    background-color: var(--color-primary-dark);
                }
                .qty-text {
                    padding: 0 12px;
                    font-weight: 600;
                    color: var(--color-text);
                    min-width: 20px;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
