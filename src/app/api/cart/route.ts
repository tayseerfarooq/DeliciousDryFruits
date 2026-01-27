import { NextRequest, NextResponse } from 'next/server';
import { getCart, updateCart, getProductById } from '@/lib/database';
import { verifyToken, extractToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(
            request.headers.get('authorization') || undefined,
            request.cookies.get('auth_token')?.value
        );

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const cart = getCart(payload.userId);
        if (!cart) {
            return NextResponse.json({ cart: { items: [], total: 0 } });
        }

        // Enrich cart with product details
        const enrichedItems = cart.items.map(item => {
            const product = getProductById(item.productId);
            const variant = product?.variants.find(v => v.id === item.variantId);

            return {
                ...item,
                product: product ? {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    images: product.images
                } : null,
                variant: variant ? {
                    id: variant.id,
                    weight: variant.weight,
                    price: variant.price,
                    stock: variant.stock
                } : null
            };
        });

        const total = enrichedItems.reduce((sum, item) => {
            if (item.variant) {
                return sum + (item.variant.price * item.quantity);
            }
            return sum;
        }, 0);

        return NextResponse.json({
            cart: {
                ...cart,
                items: enrichedItems,
                total
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(
            request.headers.get('authorization') || undefined,
            request.cookies.get('auth_token')?.value
        );

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, variantId, quantity = 1 } = body;

        if (!productId || !variantId) {
            return NextResponse.json(
                { error: 'Product ID and variant ID are required' },
                { status: 400 }
            );
        }

        // Verify product and variant exist
        const product = getProductById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const variant = product.variants.find(v => v.id === variantId);
        if (!variant) {
            return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
        }

        if (variant.stock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }

        // Get current cart
        const currentCart = getCart(payload.userId);
        const items = currentCart?.items || [];

        // Check if item already exists in cart
        const existingItemIndex = items.findIndex(
            item => item.productId === productId && item.variantId === variantId
        );

        if (existingItemIndex >= 0) {
            items[existingItemIndex].quantity += quantity;
        } else {
            items.push({ productId, variantId, quantity });
        }

        const updatedCart = await updateCart(payload.userId, items);

        return NextResponse.json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = extractToken(
            request.headers.get('authorization') || undefined,
            request.cookies.get('auth_token')?.value
        );

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, variantId, quantity } = body;

        if (!productId || !variantId || quantity === undefined) {
            return NextResponse.json(
                { error: 'Product ID, variant ID, and quantity are required' },
                { status: 400 }
            );
        }

        const currentCart = getCart(payload.userId);
        let items = currentCart?.items || [];

        if (quantity === 0) {
            // Remove item
            items = items.filter(
                item => !(item.productId === productId && item.variantId === variantId)
            );
        } else {
            // Update quantity
            const itemIndex = items.findIndex(
                item => item.productId === productId && item.variantId === variantId
            );

            if (itemIndex >= 0) {
                items[itemIndex].quantity = quantity;
            }
        }

        const updatedCart = await updateCart(payload.userId, items);

        return NextResponse.json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
