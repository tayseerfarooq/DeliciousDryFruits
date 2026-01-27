import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const filters: { categoryId?: string; search?: string } = {};

        if (category) filters.categoryId = category;
        if (search) filters.search = search;

        const products = getProducts(filters);

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
