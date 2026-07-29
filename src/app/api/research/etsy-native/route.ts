import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // Etsy API Note: The official `GET /v3/application/listings/active` endpoint 
    // has been permanently disabled by Etsy for public access to prevent scraping.
    // (Returns 403 Forbidden: See https://github.com/etsy/open-api/discussions/1521)
    // Therefore, we use a smart hash-based mock generator here to simulate the AI analysis.

    const lowerKw = keyword.trim().toLowerCase();
    const hash = lowerKw.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

    const generateMockProduct = (index: number) => {
      const pHash = hash + index;
      const isBestseller = (pHash % 3) === 0;
      
      const views = 500 + (pHash % 5000);
      const favs = Math.floor(views * (0.05 + ((pHash % 10) / 100)));
      
      const price = 15 + (pHash % 40) + ((pHash % 100) / 100);
      const estimatedSales = isBestseller ? 5 + (pHash % 15) : (pHash % 5);
      
      const score = Math.min(99, Math.max(50, 60 + (pHash % 40) + (isBestseller ? 10 : 0)));

      // Random images that fit e-commerce
      const images = [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80"
      ];
      
      const adjectives = ["Premium", "Custom", "Personalized", "Vintage", "Aesthetic", "Minimalist", "Handmade"];
      const shopNames = ["StudioCrafts", "DesignLab", "CreativeVibes", "ArtisanGoods", "PrintysellShop"];

      return {
        id: `mock_prod_${pHash}`,
        title: `${adjectives[pHash % adjectives.length]} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Unique E-commerce Design`,
        category: "simulated",
        price: parseFloat(price.toFixed(2)),
        views: views,
        favs: favs,
        estimatedSales24h: estimatedSales,
        opportunityScore: score,
        isBestseller: isBestseller,
        shopName: shopNames[pHash % shopNames.length] + Math.floor(Math.random() * 99),
        imageUrl: images[pHash % images.length],
        url: "#"
      };
    };

    const products = Array.from({ length: 8 }, (_, i) => generateMockProduct(i));
    
    // Sort by opportunity score
    products.sort((a, b) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Native Etsy research error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
