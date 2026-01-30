'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/models';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryId = searchParams.get('category') || '';

    // Local state for data only
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    // Search query remains local state to allow typing without URL updates until submission (if implemented) or simple filtering
    // In this implementation it filters the fetch but doesn't sync to URL to match previous behavior
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products whenever categoryId (from URL) or searchQuery (local) changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (categoryId) params.append('category', categoryId);
                if (searchQuery) params.append('search', searchQuery);

                const res = await fetch(`/api/products?${params}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, searchQuery]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) {
            params.set('category', id);
        } else {
            params.delete('category');
        }
        // Use router.push to navigate, which updates the URL and triggers the useEffect via searchParams
        router.push(`/products?${params.toString()}`);
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
                                        checked={categoryId === ''}
                                        onChange={() => handleCategoryChange('')}
                                    />
                                    <span>All Products</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={categoryId === cat.id}
                                            onChange={() => handleCategoryChange(cat.id)}
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
            <div className="container py-3xl text-center">
                <div className="spinner spinner-primary" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
                <p>Loading...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
