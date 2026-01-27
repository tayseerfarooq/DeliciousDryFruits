import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            marginTop: 'auto'
        }}>
            <div className="container py-3xl">
                <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    {/* Brand */}
                    <div>
                        <h3 style={{
                            color: 'var(--color-accent)',
                            marginBottom: 'var(--spacing-md)',
                            fontSize: '1.5rem'
                        }}>
                            Delicious Dry Fruits
                        </h3>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                            Premium quality dry fruits, nuts, and healthy snacks delivered fresh to your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <Link href="/products" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>All Products</Link>
                            <Link href="/products?category=cat-001" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Premium Nuts</Link>
                            <Link href="/products?category=cat-002" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Dried Fruits</Link>
                            <Link href="/products?category=cat-004" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Gift Hampers</Link>
                        </div>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Customer Service</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <Link href="/orders" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Track Order</Link>
                            <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Shipping Policy</a>
                            <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Return Policy</a>
                            <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>FAQ</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', color: 'rgba(255, 255, 255, 0.8)' }}>
                            <p>📧 info@deliciousdryfruits.com</p>
                            <p>📞 +91 98765 43210</p>
                            <p>📍 Mumbai, India</p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)' }}>
                                <a href="#" style={{ fontSize: '1.5rem' }}>📘</a>
                                <a href="#" style={{ fontSize: '1.5rem' }}>📷</a>
                                <a href="#" style={{ fontSize: '1.5rem' }}>🐦</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: 'var(--spacing-lg)',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <p>© {currentYear} Delicious Dry Fruits. All rights reserved.</p>
                    <p style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.875rem' }}>
                        Made with ❤️ for premium quality and healthy living
                    </p>
                </div>
            </div>
        </footer>
    );
}
