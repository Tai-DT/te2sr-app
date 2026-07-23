import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/store';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ success: true, orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appName, clientEmail, platform, serviceType, targetCountries, details } = body;

    if (!appName || !clientEmail) {
      return NextResponse.json(
        { success: false, error: 'App name and client email are required.' },
        { status: 400 }
      );
    }

    const order = addOrder({
      appName,
      clientEmail,
      platform: platform || 'Both',
      serviceType: serviceType || 'Testing',
      targetCountries: targetCountries || ['Worldwide'],
      details: details || '',
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order.' },
      { status: 500 }
    );
  }
}
