import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productCode = searchParams.get('productCode');
  const apiKey = process.env.REZDY_API_KEY;

  if (!productCode) return NextResponse.json({ error: 'No code' }, { status: 400 });

  try {
    const response = await fetch(`https://api.rezdy.com/v1/availability?apiKey=${apiKey}&productCode=${productCode}`);
    const data = await response.json();
    return NextResponse.json(data.sessions || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
