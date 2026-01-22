import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.REZDY_API_KEY;
  // Category 541037 is your "Party at Red Rocks" folder
  const url = `https://api.rezdy.com/v1/products?apiKey=${apiKey}&categoryId=541037`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // We also want to make sure the Mishawaka codes are included
    const mishawakaCodes = ['PGG11Z', 'PB7VBT'];
    const filteredProducts = data.products.filter((p: any) => 
      p.productCode.includes('PGG') || 
      p.productCode.includes('PB7') || 
      mishawakaCodes.includes(p.productCode)
    );

    return NextResponse.json(filteredProducts.length > 0 ? filteredProducts : data.products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch specific products' }, { status: 500 });
  }
}
