import { NextRequest, NextResponse } from 'next/server';
import { getCart, getProductById, createOrder, clearCart } from '@/lib/database';
import { verifyToken, extractToken } from '@/lib/auth';
import { OrderItem, Address } from '@/lib/models';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || ''
        });

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
        const { shippingAddress } = body;

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
            return NextResponse.json(
                { error: 'Complete shipping address is required' },
                { status: 400 }
            );
        }

        // Get user's cart
        const cart = getCart(payload.userId);
        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Calculate order totals
        const orderItems: OrderItem[] = [];
        let subtotal = 0;

        for (const item of cart.items) {
            const product = getProductById(item.productId);
            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }

            const variant = product.variants.find(v => v.id === item.variantId);
            if (!variant) {
                return NextResponse.json(
                    { error: `Variant ${item.variantId} not found` },
                    { status: 404 }
                );
            }

            if (variant.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name} - ${variant.weight}` },
                    { status: 400 }
                );
            }

            const itemTotal = variant.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                variantId: variant.id,
                variantWeight: variant.weight,
                quantity: item.quantity,
                price: variant.price,
                total: itemTotal
            });
        }

        const shipping = subtotal > 999 ? 0 : 50; // Free shipping above ₹999
        const tax = Math.round(subtotal * 0.05); // 5% tax
        const total = subtotal + shipping + tax;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: total * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        });

        // Create order in database (pending status)
        const order = await createOrder({
            userId: payload.userId,
            items: orderItems,
            subtotal,
            shipping,
            tax,
            total,
            status: 'pending',
            shippingAddress: shippingAddress as Address,
            razorpayOrderId: razorpayOrder.id
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: order.total
            },
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
