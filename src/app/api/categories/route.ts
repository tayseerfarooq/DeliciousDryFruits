import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getProducts } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const categories = getCategories();
        const products = getProducts();

        // Add product count to each category
        const categoriesWithCount = categories.map(category => ({
            ...category,
            productCount: products.filter(p => p.categoryId === category.id).length
        }));

        return NextResponse.json({ categories: categoriesWithCount });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
