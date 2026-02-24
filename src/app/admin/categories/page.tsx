'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    displayOrder: number;
}

const emptyCategory = { name: '', slug: '', description: '', image: '', displayOrder: 0 };

export default function AdminCategoriesPage() {
    const { user, loading } = useAdminAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyCategory);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) fetchCategories();
    }, [user]);

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        if (res.ok) {
            const d = await res.json();
            setCategories(d.categories);
        }
    };

    const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const openAddForm = () => {
        setEditingId(null);
        setForm({ ...emptyCategory });
        setShowForm(true);
        setMessage('');
    };

    const openEditForm = (c: Category) => {
        setEditingId(c.id);
        setForm({
            name: c.name, slug: c.slug, description: c.description,
            image: c.image, displayOrder: c.displayOrder
        });
        setShowForm(true);
        setMessage('');
    };

    const handleSave = async () => {
        if (!form.name) {
            setMessage('Category name is required.');
            return;
        }

        setSaving(true);
        setMessage('');
        const slug = form.slug || autoSlug(form.name);
        const payload = { ...form, slug };

        try {
            let res;
            if (editingId) {
                res = await fetch('/api/admin/categories', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...payload })
                });
            } else {
                res = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setMessage(editingId ? 'Category updated!' : 'Category created!');
                setShowForm(false);
                fetchCategories();
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
        if (!confirm(`Delete category "${name}"? Products in this category will lose their category.`)) return;
        const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setMessage('Category deleted');
            fetchCategories();
        }
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
                    <h1 style={{ marginTop: 'var(--spacing-xs)' }}>Category Management</h1>
                </div>
                <button className="btn btn-primary" onClick={openAddForm}>+ Add Category</button>
            </div>

            {message && (
                <div className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', backgroundColor: 'var(--color-cream-light)' }}>
                    {message}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{editingId ? 'Edit Category' : 'Add New Category'}</h2>

                    <div className="grid grid-2" style={{ gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input className="form-input" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input className="form-input" value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input className="form-input" value={form.image} placeholder="/images/categories/example.png"
                                onChange={e => setForm({ ...form, image: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Display Order</label>
                            <input className="form-input" type="number" value={form.displayOrder}
                                onChange={e => setForm({ ...form, displayOrder: Number(e.target.value) })} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="form-label">Description</label>
                        <textarea className="form-input" rows={3} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Category List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {categories.map(c => (
                    <div key={c.id} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{c.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>/{c.slug} · Order: {c.displayOrder}</div>
                                {c.description && <div style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-xs)' }}>{c.description}</div>}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEditForm(c)}>Edit</button>
                                <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                    onClick={() => handleDelete(c.id, c.name)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-light)' }}>No categories found.</div>
                )}
            </div>
        </div>
    );
}
