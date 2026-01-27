import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/models';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const minPrice = Math.min(...product.variants.map(v => v.price));
    const maxPrice = Math.max(...product.variants.map(v => v.price));
    const priceDisplay = minPrice === maxPrice
        ? `₹${minPrice}`
        : `₹${minPrice} - ₹${maxPrice}`;

    return (
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
            <div className="card card-product">
                <div className="card-product-image">
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
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--color-cream-light)',
                            color: 'var(--color-text-lighter)'
                        }}>
                            No Image
                        </div>
                    )}
                    {product.featured && (
                        <span style={{
                            position: 'absolute',
                            top: 'var(--spacing-sm)',
                            right: 'var(--spacing-sm)',
                            backgroundColor: 'var(--color-accent)',
                            color: 'var(--color-brown-100)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Featured
                        </span>
                    )}
                </div>

                <div className="card-product-content">
                    <h3 className="card-product-title">{product.name}</h3>
                    <p style={{
                        color: 'var(--color-text-light)',
                        fontSize: '0.875rem',
                        marginBottom: 'var(--spacing-sm)',
                        flex: 1
                    }}>
                        {product.shortDescription}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto'
                    }}>
                        <div className="card-product-price">{priceDisplay}</div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-lighter)',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                        }}>
                            {product.variants.length} size{product.variants.length > 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
