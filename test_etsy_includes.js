require('dotenv').config({ path: '.env.local' });

async function test() {
  const ETSY_API_KEY = process.env.ETSY_API_KEY;
  const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
  
  if (!ETSY_API_KEY) {
    console.log("No key");
    return;
  }
  
  console.log("Fetching with includes...");
  const res = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=t-shirt&limit=2&includes=Images,Shop`, {
    headers: {
      "x-api-key": `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
    }
  });
  
  const text = await res.text();
  console.log(text);
}

test();
