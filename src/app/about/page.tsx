'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
                padding: 'var(--spacing-3xl) 0'
            }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                        About <span style={{ color: 'var(--color-primary)' }}>Delicious Dry Fruits</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--color-text-light)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.8'
                    }}>
                        Bringing you the finest quality dry fruits and nuts, sourced directly from the best farms across the globe — right to your doorstep.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-3xl">
                <div className="container">
                    <div className="grid grid-2" style={{ alignItems: 'center', gap: 'var(--spacing-2xl)' }}>
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Our Story</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--color-text-light)' }}>
                                Founded with a passion for quality and health, Delicious Dry Fruits started as a small family-run stall at <strong style={{ color: 'var(--color-text)' }}>Russel Market, Shivajinagar, Bangalore</strong>. Over the years, we have grown into a trusted name in the dry fruits industry, serving thousands of happy customers across India.
                            </p>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--color-text-light)' }}>
                                With over <strong style={{ color: 'var(--color-primary)' }}>15 years of experience</strong> in sourcing, selecting, and delivering premium dry fruits, we understand what quality truly means. Every product in our collection is hand-picked, freshness-tested, and hygienically packed to ensure you get nothing but the best.
                            </p>
                        </div>
                        <div style={{
                            position: 'relative',
                            aspectRatio: '4/3',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-2xl)',
                            backgroundColor: 'var(--color-cream-light)'
                        }}>
                            <Image
                                src="/images/products/mixed_nuts_1769455895711.png"
                                alt="Our premium dry fruits collection"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-3xl" style={{ backgroundColor: 'var(--color-cream-light)' }}>
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Why Choose Us?</h2>
                        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}>
                            Here&apos;s what sets us apart from the rest
                        </p>
                    </div>
                    <div className="grid grid-4">
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🌿</div>
                            <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>100% Natural</h4>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                                No preservatives, no chemicals. Just pure, natural goodness straight from the farm.
                            </p>
                        </div>
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                            <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>Quality Assured</h4>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                                Every batch is rigorously tested for freshness, taste, and hygiene before reaching you.
                            </p>
                        </div>
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
                            <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>Secure Packaging</h4>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                                Vacuum-sealed, airtight packaging to preserve freshness and flavor for longer.
                            </p>
                        </div>
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🚚</div>
                            <h4 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>Fast Delivery</h4>
                            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                                Quick and reliable delivery across India. Free shipping on orders above ₹999.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience & Numbers */}
            <section className="py-3xl">
                <div className="container">
                    <div className="text-center mb-2xl">
                        <h2>Our Journey in Numbers</h2>
                    </div>
                    <div className="grid grid-4">
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-family-serif)' }}>15+</div>
                            <div style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-xs)' }}>Years of Experience</div>
                        </div>
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-family-serif)' }}>5000+</div>
                            <div style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-xs)' }}>Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-family-serif)' }}>50+</div>
                            <div style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-xs)' }}>Premium Products</div>
                        </div>
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-family-serif)' }}>10+</div>
                            <div style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-xs)' }}>Cities Served</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit Us */}
            <section className="py-3xl" style={{ backgroundColor: 'var(--color-cream-light)' }}>
                <div className="container text-center">
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Visit Our Store</h2>
                    <div className="card" style={{
                        maxWidth: '550px',
                        margin: '0 auto',
                        padding: 'var(--spacing-2xl)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📍</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Delicious Dry Fruits</h3>
                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', lineHeight: '1.8' }}>
                            Russel Market, Shivajinagar<br />
                            Bangalore, Karnataka, India
                        </p>
                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'var(--color-cream)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.95rem',
                            color: 'var(--color-text-light)'
                        }}>
                            <strong style={{ color: 'var(--color-text)' }}>📞 Phone:</strong> +91 98765 43210<br />
                            <strong style={{ color: 'var(--color-text)' }}>✉️ Email:</strong> info@deliciousdryfruits.com
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @media (max-width: 768px) {
                    .grid-2 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
}
