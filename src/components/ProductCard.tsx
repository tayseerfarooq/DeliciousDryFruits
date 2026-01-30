'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/models';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [adding, setAdding] = useState(false);

    const minPrice = Math.min(...product.variants.map(v => v.price));
    const maxPrice = Math.max(...product.variants.map(v => v.price));
    const priceDisplay = minPrice === maxPrice
        ? `₹${minPrice}`
        : `₹${minPrice} - ₹${maxPrice}`;

    const handleAddToCart = async (e: React.MouseEvent) => {
        // e.preventDefault() is implicitly handled if not in a link, but good practice
        e.preventDefault();
        e.stopPropagation();

        if (adding) return;
        setAdding(true);

        try {
            const defaultVariant = product.variants[0];
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    variantId: defaultVariant.id,
                    quantity: 1
                })
            });

            if (res.ok) {
                window.dispatchEvent(new Event('cart-updated'));
            } else {
                if (res.status === 401) window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAdding(false);
        }
    };

    // Refactored structure: Button is OUTSIDE the Link
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
                        pointerEvents: 'none'
                    }}>
                        Featured
                    </span>
                )}

                {/* Button is sibling to Link, positioned absolutely on top */}
                <button
                    onClick={handleAddToCart}
                    className="btn-quick-add"
                    title="Quick Add to Cart"
                    type="button"
                >
                    {adding ? (
                        <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                    ) : (
                        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span>
                    )}
                </button>
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
                .btn-quick-add {
                    position: absolute;
                    bottom: var(--spacing-sm);
                    right: var(--spacing-sm);
                    z-index: 20; /* Higher than before */
                    padding: 0.5rem;
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
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.2s ease-in-out;
                }
                
                /* Show on hover of the card image container */
                .card-product-image:hover .btn-quick-add,
                .btn-quick-add:focus-visible,
                .btn-quick-add:hover {
                    opacity: 1;
                    transform: translateY(0) !important;
                }

                .btn-quick-add:hover {
                    background-color: var(--color-primary-dark);
                    transform: scale(1.1) translateY(0) !important;
                }
            `}</style>
        </div>
    );
}
