require('dotenv').config({ path: '.env.local' });

async function test() {
  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
  
  const headers = {
    "x-api-key": `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
  };

  const searchRes = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=t-shirt&limit=2`, { headers });
  const data = await searchRes.json();
  const rawListings = data.results || [];
  
  for (const item of rawListings) {
    const listingId = item.listing_id;
    const imageRes = await fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images`, { headers });
    let imageUrl = "fallback";
    if (imageRes.ok) {
      const imgData = await imageRes.json();
      const imgs = imgData.results || [];
      if (imgs.length > 0) {
        imageUrl = imgs[0].url_570xN || imgs[0].url_fullxfull || imageUrl;
      }
    }
    console.log("Listing:", listingId, "Image:", imageUrl);
  }
}

test();
