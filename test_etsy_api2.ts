import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const prisma = new PrismaClient();

async function run() {
  const keyword = 'shirt';
  const tokenRecord = await prisma.etsyToken.findFirst();
  if (!tokenRecord) {
    console.log("No token in DB");
    return;
  }
  
  const accessToken = tokenRecord.accessToken; 
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': `${process.env.ETSY_API_KEY}:${process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET}`,
    'Content-Type': 'application/json',
  };

  console.log("Fetching...");
  const res = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=${keyword}&limit=10&sort_on=score`, { headers });
  const data = await res.json();
  console.log("Status:", res.status);
  
  if (data.results) {
    for (const item of data.results) {
      console.log(`Title: ${item.title?.substring(0, 30)}... Views: ${item.views}, Favs: ${item.num_favorers}`);
    }
  } else {
    console.log(data);
  }
}
run();
