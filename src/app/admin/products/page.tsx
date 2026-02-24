'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface Variant {
    id: string;
    weight: string;
    price: number;
    stock: number;
    sku: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    categoryId: string;
    images: string[];
    variants: Variant[];
    featured: boolean;
}

interface Category {
    id: string;
    name: string;
}

const emptyProduct = {
    name: '', slug: '', description: '', shortDescription: '', categoryId: '',
    images: [] as string[], variants: [] as Variant[], featured: false
};

const emptyVariant: Variant = { id: '', weight: '', price: 0, stock: 0, sku: '' };

export default function AdminProductsPage() {
    const { user, loading } = useAdminAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyProduct);
    const [variants, setVariants] = useState<Variant[]>([{ ...emptyVariant }]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        const [pRes, cRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/categories')
        ]);
        if (pRes.ok) {
            const d = await pRes.json();
            setProducts(d.products);
        }
        if (cRes.ok) {
            const d = await cRes.json();
            setCategories(d.categories);
        }
    };

    const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const openAddForm = () => {
        setEditingId(null);
        setForm({ ...emptyProduct });
        setVariants([{ ...emptyVariant }]);
        setShowForm(true);
        setMessage('');
    };

    const openEditForm = (p: Product) => {
        setEditingId(p.id);
        setForm({
            name: p.name, slug: p.slug, description: p.description,
            shortDescription: p.shortDescription, categoryId: p.categoryId,
            images: p.images, variants: p.variants, featured: p.featured
        });
        setVariants(p.variants.length > 0 ? [...p.variants] : [{ ...emptyVariant }]);
        setShowForm(true);
        setMessage('');
    };

    const addVariant = () => setVariants([...variants, { ...emptyVariant, id: `v-${Date.now()}` }]);

    const updateVariant = (i: number, field: keyof Variant, value: string | number) => {
        const updated = [...variants];
        (updated[i] as any)[field] = value;
        setVariants(updated);
    };

    const removeVariant = (i: number) => {
        if (variants.length <= 1) return;
        setVariants(variants.filter((_, idx) => idx !== i));
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                if (res.ok) {
                    const data = await res.json();
                    setForm(prev => ({ ...prev, images: [...prev.images, data.imageUrl] }));
                } else {
                    const err = await res.json();
                    setMessage(err.error || 'Upload failed');
                }
            } catch {
                setMessage('Image upload failed');
            }
        }

        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSave = async () => {
        if (!form.name || !form.categoryId || variants.length === 0) {
            setMessage('Please fill in name, category, and at least one variant.');
            return;
        }

        setSaving(true);
        setMessage('');

        const slug = form.slug || autoSlug(form.name);
        const payload = { ...form, slug, variants };

        try {
            let res;
            if (editingId) {
                res = await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...payload })
                });
            } else {
                res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setMessage(editingId ? 'Product updated!' : 'Product created!');
                setShowForm(false);
                fetchData();
            } else {
                const d = await res.json();
                setMessage(d.error || 'Failed to save');
            }
        } catch {
            setMessage('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setMessage('Product deleted');
            fetchData();
        }
    };

    const handleStockUpdate = async (productId: string, variantIndex: number, newStock: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const updatedVariants = [...product.variants];
        updatedVariants[variantIndex] = { ...updatedVariants[variantIndex], stock: newStock };

        const res = await fetch('/api/admin/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, variants: updatedVariants })
        });

        if (res.ok) fetchData();
    };

    if (loading) {
        return (
            <div className="container py-3xl" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
        );
    }
    if (!user) return null;

    return (
        <div className="container py-2xl">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                <div>
                    <Link href="/admin" style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>← Back to Dashboard</Link>
                    <h1 style={{ marginTop: 'var(--spacing-xs)' }}>Product Management</h1>
                </div>
                <button className="btn btn-primary" onClick={openAddForm}>+ Add Product</button>
            </div>

            {message && (
                <div className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', backgroundColor: 'var(--color-cream-light)' }}>
                    {message}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

                    <div className="grid grid-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <div className="form-group">
                            <label className="form-label">Product Name *</label>
                            <input className="form-input" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input className="form-input" value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select className="form-input" value={form.categoryId}
                                onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', paddingTop: 'var(--spacing-xl)' }}>
                            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                            <label>Featured Product</label>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="form-label">Short Description</label>
                        <input className="form-input" value={form.shortDescription}
                            onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="form-label">Full Description</label>
                        <textarea className="form-input" rows={4} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    {/* Product Images */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="form-label">Product Images</label>
                        <div style={{
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-light)',
                            backgroundColor: 'var(--color-cream-light)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-sm) var(--spacing-md)'
                        }}>
                            📐 Recommended size: <strong>1024 × 1024 px</strong> (square) · PNG or JPG · Max 5 MB
                        </div>

                        {/* Image Previews */}
                        {form.images.length > 0 && (
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                                {form.images.map((img, i) => (
                                    <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                        <Image src={img} alt={`Product image ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="100px" />
                                        <button onClick={() => removeImage(i)}
                                            style={{ position: 'absolute', top: '2px', right: '2px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                            onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--color-border)'; handleImageUpload(e.dataTransfer.files); }}
                            style={{
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--spacing-xl)',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s',
                                backgroundColor: 'var(--color-cream-light)'
                            }}>
                            {uploading ? (
                                <div>
                                    <div className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto var(--spacing-sm)' }} />
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Uploading...</div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>📷</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Click to upload or drag & drop</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: 'var(--spacing-xs)' }}>PNG, JPG, or WebP · 1024×1024 recommended</div>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple
                            style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files)} />
                    </div>

                    {/* Variants */}
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <label className="form-label" style={{ margin: 0 }}>Variants *</label>
                            <button className="btn btn-secondary" onClick={addVariant} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>+ Add Variant</button>
                        </div>
                        {variants.map((v, i) => (
                            <div key={i} className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)', backgroundColor: 'var(--color-cream-light)' }}>
                                <div className="grid grid-4" style={{ gap: 'var(--spacing-sm)', alignItems: 'end' }}>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Weight</label>
                                        <input className="form-input" placeholder="e.g. 250g" value={v.weight}
                                            onChange={e => updateVariant(i, 'weight', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Price (₹)</label>
                                        <input className="form-input" type="number" value={v.price || ''}
                                            onChange={e => updateVariant(i, 'price', Number(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Stock</label>
                                        <input className="form-input" type="number" value={v.stock || ''}
                                            onChange={e => updateVariant(i, 'stock', Number(e.target.value))} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label className="form-label" style={{ fontSize: '0.75rem' }}>SKU</label>
                                            <input className="form-input" value={v.sku}
                                                onChange={e => updateVariant(i, 'sku', e.target.value)} />
                                        </div>
                                        {variants.length > 1 && (
                                            <button onClick={() => removeVariant(i)}
                                                style={{ alignSelf: 'end', padding: '0.5rem', color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Product List */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Product</th>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Variants / Stock</th>
                            <th style={{ textAlign: 'center', padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Featured</th>
                            <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => {
                            const cat = categories.find(c => c.id === p.categoryId);
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{p.slug}</div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '0.875rem' }}>{cat?.name || '—'}</td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        {p.variants.map((v, vi) => (
                                            <div key={vi} style={{ fontSize: '0.8rem', display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', marginBottom: '2px' }}>
                                                <span>{v.weight} — ₹{v.price}</span>
                                                <input type="number" value={v.stock} style={{ width: '60px', padding: '2px 4px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.8rem' }}
                                                    onChange={e => handleStockUpdate(p.id, vi, Number(e.target.value))} />
                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>qty</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                                        {p.featured ? '⭐' : '—'}
                                    </td>
                                    <td style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-xs)' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEditForm(p)}>Edit</button>
                                            <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                                onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-light)' }}>No products found.</div>
                )}
            </div>
        </div>
    );
}
