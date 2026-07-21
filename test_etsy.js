const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const token = await prisma.etsyToken.findFirst();
  console.log("Token:", token ? "Found" : "Not Found");
  
  if (!token) return;

  const res = await fetch("https://api.etsy.com/v3/application/listings/active?keywords=cat&limit=1", {
    headers: {
      "x-api-key": "9wy6k798si4945fg1gco9ocd",
      "Authorization": `Bearer ${token.accessToken}`
    }
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 500));
}

test();
