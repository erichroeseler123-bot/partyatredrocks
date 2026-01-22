import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.REZDY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

  try {
    const response = await fetch(`https://api.rezdy.com/v1/products?apiKey=${apiKey}`);
    const data = await response.json();
    
    // Define your specific product IDs
    const redRocksIds = ['P0U1MY', 'P5FACM', 'PLQWXF'];
    const mishawakaIds = ['PGG11Z', 'PB7VBT'];

    // Filter products to only include your specific offerings
    const products = (data.products || []).filter((p: any) => 
      redRocksIds.includes(p.productCode) || 
      mishawakaIds.includes(p.productCode)
    );
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
