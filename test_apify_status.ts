import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
  const token = process.env.APIFY_TOKEN;
  console.log("Token:", token?.substring(0, 5) + "...");
  
  // 1. Start a run
  const postRes = await fetch(`https://api.apify.com/v2/acts/crawlerbros~etsy-scraper/runs?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchQuery: "halloween shirt",
      queries: ["halloween shirt"],
      keywords: ["halloween shirt"],
      searchQueries: ["halloween shirt"],
      searchTerms: ["halloween shirt"],
      searchUrls: [
        `https://www.etsy.com/search?q=halloween%20shirt`
      ],
      startUrls: [
        {
          url: `https://www.etsy.com/search?q=halloween%20shirt`
        }
      ],
      maxItems: 150,
      maxPages: 4,
      proxyConfiguration: {
        useApifyProxy: true
      }
    })
  });
  
  const runInfo = await postRes.json();
  const runId = runInfo.data?.id;
  const datasetId = runInfo.data?.defaultDatasetId;
  console.log("Run started:", runId, datasetId);
  
  // 2. Poll status
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusRes.json();
    console.log("Status:", statusData.data?.status);
    if (statusData.data?.status === "SUCCEEDED") {
      const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`);
      const items = await datasetRes.json();
      console.log("Dataset items count:", items.length);
      break;
    }
  }
}

test().catch(console.error);
