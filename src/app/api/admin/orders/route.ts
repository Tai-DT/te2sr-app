import { NextRequest, NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/lib/store';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    const updated = updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
