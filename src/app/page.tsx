import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/database';
import Image from 'next/image';
import HeroVideo from '@/components/HeroVideo';

export default function HomePage() {
  const products = getProducts({});
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const categories = getCategories();

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
        padding: 'var(--spacing-3xl) 0'
      }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-2xl)' }}>
            <div>
              <h1 style={{
                fontSize: '3.5rem',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: '1.1'
              }}>
                Premium Quality <span style={{ color: 'var(--color-primary)' }}>Dry Fruits</span> & Nuts
              </h1>
              <p style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-light)',
                marginBottom: 'var(--spacing-xl)',
                lineHeight: '1.8'
              }}>
                Hand-picked, naturally delicious, and packed with nutrition. Experience the finest selection of premium dry fruits delivered fresh to your doorstep.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Shop Now
                </Link>
                <Link href="/products?category=cat-004" className="btn btn-secondary btn-lg">
                  Gift Hampers
                </Link>
              </div>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-2xl)',
                marginTop: 'var(--spacing-2xl)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>100%</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Natural</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>500+</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Happy Customers</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>24hr</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Delivery</div>
                </div>
              </div>
            </div>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-2xl)'
            }}>
              <HeroVideo
                staticImageSrc="/images/hero-video-fallback.jpg"
                staticImageAlt="Premium Mixed Nuts"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-3xl">
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>Shop by Category</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}>
              Explore our premium selection across all categories
            </p>
          </div>
          <div className="grid grid-4">
            {categories.map(category => (
              <Link key={category.id} href={`/products?category=${category.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%',
                    marginBottom: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-cream-light)'
                  }}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>{category.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-3xl" style={{ backgroundColor: 'var(--color-cream-light)' }}>
        <div className="container">
          <div className="text-center mb-2xl">
            <h2>Featured Products</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}>
              Our most popular and premium selections
            </p>
          </div>
          <div className="grid grid-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-xl">
            <Link href="/products" className="btn btn-primary btn-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-3xl">
        <div className="container">
          <div className="grid grid-4">
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🌿</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>100% Natural</h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                No artificial preservatives or additives
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🚚</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Fast Delivery</h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Free shipping on orders above ₹999
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>⭐</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Premium Quality</h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Hand-picked from the finest sources
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔒</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Secure Payment</h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Safe and secure online payments
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
