import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, clearCart, getProductById, updateProduct } from '@/lib/database';
import { verifyToken, extractToken } from '@/lib/auth';
import crypto from 'crypto';

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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
            return NextResponse.json(
                { error: 'Missing payment verification data' },
                { status: 400 }
            );
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(sign)
            .digest('hex');

        if (expectedSign !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Get order
        const order = getOrderById(order_id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Verify user owns this order
        if (order.userId !== payload.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Update order status
        await updateOrder(order_id, {
            status: 'confirmed',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        });

        // Reduce stock for all items
        for (const item of order.items) {
            const product = getProductById(item.productId);
            if (product) {
                const updatedVariants = product.variants.map(v => {
                    if (v.id === item.variantId) {
                        return { ...v, stock: v.stock - item.quantity };
                    }
                    return v;
                });
                await updateProduct(product.id, { variants: updatedVariants });
            }
        }

        // Clear cart
        await clearCart(payload.userId);

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
