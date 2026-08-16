import { config } from 'dotenv';
config({ path: '.env.local' });

async function testEtsy() {
  const apiKey = process.env.ETSY_API_KEY;
  const keyword = "halloween shirt";
  
  const response = await fetch(`https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=10&sort_on=score`, {
    headers: {
      "x-api-key": apiKey || "",
    }
  });
  
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    for (const item of data.results) {
      console.log(`Title: ${item.title.substring(0, 30)}...`);
      console.log(`Views: ${item.views}, Favs: ${item.num_favorers}`);
    }
  } else {
    console.log("No results or error:", data);
  }
}

testEtsy().catch(console.error);
