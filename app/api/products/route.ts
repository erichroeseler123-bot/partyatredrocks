import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.REZDY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

  try {
    const response = await fetch(`https://api.rezdy.com/v1/products?apiKey=${apiKey}`);
    const data = await response.json();
    return NextResponse.json(data.products || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
