'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/models';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
    };

    return (
        <div className="container py-2xl">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>All Products</h1>

            <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-2xl)' }}>
                {/* Filters Sidebar */}
                <aside>
                    <div className="card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-lg)' }}>Filters</h3>

                        {/* Search */}
                        <div className="form-group">
                            <label className="form-label">Search</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === ''}
                                        onChange={() => setSelectedCategory('')}
                                    />
                                    <span>All Products</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat.id}
                                            onChange={() => setSelectedCategory(cat.id)}
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div>
                    {loading ? (
                        <div className="text-center py-3xl">
                            <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
                            <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-light)' }}>Loading products...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-light)' }}>
                                Showing {products.length} products
                            </div>
                            <div className="grid grid-3">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-3xl">
                            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-light)' }}>No products found</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
          }
        }
      `}</style>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container py-3xl">
                <div className="text-center py-3xl">
                    <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
                    <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-light)' }}>Loading products...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
