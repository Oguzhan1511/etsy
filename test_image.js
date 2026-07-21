require('dotenv').config({ path: '.env.local' });

async function test() {
  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
  const listingId = 4475051405; // From previous results
  
  const headers = {
    "x-api-key": `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
  };

  const imageRes = await fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images`, { headers });
  console.log("Status:", imageRes.status);
  const text = await imageRes.text();
  console.log("Body:", text.substring(0, 500));
}

test();
