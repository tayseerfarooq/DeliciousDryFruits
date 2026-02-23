'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BulkOrdersPage() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        productInterest: '',
        quantity: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder — in production this would send data to API
        setSubmitted(true);
    };

    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--color-cream-light) 0%, var(--color-cream) 100%)',
                padding: 'var(--spacing-3xl) 0'
            }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
                        <span style={{ color: 'var(--color-primary)' }}>Bulk Orders</span> & Corporate Gifting
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--color-text-light)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: '1.8'
                    }}>
                        Premium dry fruits at wholesale prices for businesses, events, weddings, and corporate gifting. Get special bulk pricing and GST invoices.
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-3xl">
                <div className="container">
                    <div className="grid grid-3">
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💰</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Wholesale Pricing</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>
                                Get the best rates on bulk purchases. Up to 30% off on orders above 10kg.
                            </p>
                        </div>
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎁</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>Custom Packaging</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>
                                Branded gift boxes and custom hampers for corporate events, festivals, and weddings.
                            </p>
                        </div>
                        <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📄</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)' }}>GST Invoice</h3>
                            <p style={{ color: 'var(--color-text-light)' }}>
                                Proper GST-compliant invoices provided for all business orders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Details & Form */}
            <section className="py-3xl" style={{ backgroundColor: 'var(--color-cream-light)' }}>
                <div className="container">
                    <div className="grid grid-2" style={{ gap: 'var(--spacing-2xl)', alignItems: 'start' }}>

                        {/* Business Info */}
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Business Details</h2>

                            <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                                    🏢 Company Information
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Business Name</div>
                                        <div style={{ color: 'var(--color-text-light)' }}>Delicious Dry Fruits</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>GST Number</div>
                                        <div style={{
                                            color: 'var(--color-primary)',
                                            fontWeight: '700',
                                            fontSize: '1.1rem',
                                            fontFamily: 'monospace',
                                            backgroundColor: 'var(--color-cream)',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'inline-block'
                                        }}>
                                            29ABCDE1234F1Z5
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Address</div>
                                        <div style={{ color: 'var(--color-text-light)', lineHeight: '1.7' }}>
                                            Russel Market, Shivajinagar<br />
                                            Bangalore, Karnataka, India
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                                    📞 Contact for Bulk Orders
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Phone</div>
                                        <div style={{ color: 'var(--color-text-light)' }}>+91 98765 43210</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>WhatsApp</div>
                                        <div style={{ color: 'var(--color-text-light)' }}>+91 98765 43210</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Email</div>
                                        <div style={{ color: 'var(--color-text-light)' }}>bulk@deliciousdryfruits.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimum Order Info */}
                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-lg)',
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
                                    Minimum Bulk Order: 5 kg
                                </div>
                                <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                    Special rates available for orders above 25 kg
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div>
                            <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Request a Quote</h2>

                            {submitted ? (
                                <div className="card" style={{
                                    padding: 'var(--spacing-2xl)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Thank You!</h3>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-lg)' }}>
                                        We&apos;ve received your bulk order inquiry. Our team will get back to you within 24 hours with the best pricing.
                                    </p>
                                    <Link href="/products" className="btn btn-primary">
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Your Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-input"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Company Name</label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    className="form-input"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    placeholder="Your Company"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-input"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="you@company.com"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="form-input"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-2" style={{ gap: 'var(--spacing-md)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Product Interest</label>
                                                <select
                                                    name="productInterest"
                                                    className="form-input"
                                                    value={formData.productInterest}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="nuts">Premium Nuts</option>
                                                    <option value="dried-fruits">Dried Fruits</option>
                                                    <option value="seeds">Seeds & Trail Mix</option>
                                                    <option value="gift-hampers">Gift Hampers</option>
                                                    <option value="mixed">Mixed / Custom Order</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Estimated Quantity (kg)</label>
                                                <input
                                                    type="text"
                                                    name="quantity"
                                                    className="form-input"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    placeholder="e.g. 10 kg, 50 kg"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Additional Details</label>
                                            <textarea
                                                name="message"
                                                className="form-input"
                                                value={formData.message}
                                                onChange={handleChange as any}
                                                placeholder="Tell us about your requirements — event type, custom packaging, delivery date, etc."
                                                style={{ minHeight: '120px', resize: 'vertical' }}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                            Submit Bulk Order Inquiry
                                        </button>
                                    </form>
                                </div>
                            )}
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
