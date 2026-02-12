import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = process.env.REZDY_API_KEY;

  try {
    const response = await fetch(`https://api.rezdy.com/v1/bookings?apiKey=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
