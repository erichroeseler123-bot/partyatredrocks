import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venue = searchParams.get('venue'); // 'mishawaka' or 'redrocks'
  const apiKey = process.env.REZDY_API_KEY;

  try {
    const response = await fetch(`https://api.rezdy.com/v1/products?apiKey=${apiKey}`);
    const data = await response.json();
    
    // Group IDs by venue
    const mishawakaIds = ['PGG11Z', 'PB7VBT'];
    const redRocksIds = ['P0U1MY', 'P5FACM', 'PLQWXF'];

    let filtered = data.products || [];

    if (venue === 'mishawaka') {
      filtered = filtered.filter((p: any) => mishawakaIds.includes(p.productCode));
    } else if (venue === 'redrocks') {
      filtered = filtered.filter((p: any) => redRocksIds.includes(p.productCode));
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
