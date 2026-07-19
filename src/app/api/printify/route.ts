import { NextResponse } from "next/server";

const PRINTIFY_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiNzQ0YmQzMDM1ZmUxMWU1YTgwM2FiN2I2YjJjNjY5NylsImpvIasI6ImFmMmMmNhMDM2MTI1ODJkMGE5YmFiOTg1NTQ0YWIwOGEwNTEwOWEwNTEwOWEwNTEwMDZkODZkWQwyZm5E5Yjk2ZTUwYTRjZDVpMjFiNmE1OWQ1MjQwliwiaWFOIjoxNzg0MzcyMzI1LCjwMDcyNiwibWJsbjoxNzg0Mzg5MzMzMSIsInJvM2NteHdwOCwiZHhwIjoxODE5TE5lSjY5NTEwNSwic3Viljoimc5MDg3NzUiLCJzY29yZ29wZXMiOls2hvcHMubWFuyWdIiwic2hvcMucmVhZClsImNhZGFsb2cucmVuZmVhZClsIm9yZGVycy5zWzFkliwib3JkZXJzLndyaXRlliwicHJvZHJ1bHhmdmNzbInByb2R1Y3RzLnRndmRmd2ViaG9va3MvZCIsIndsIndyY2xsawidXbsb2Fkcy5yZWFlMDQyZ23MucmVhZClsIndsYmhiM2tzLndyaXFlliwidXbsb2Fkcy53cml0Z253cml0Z2Z3SlZSlslnByaW50ZXJzLml0I5pbmZvbVllOS19QkF0GO_LLIdZoKDmkEGelmeZYb5vaapn6l6BeYoMDVJDMeF21783rfyfCEHj5jBrHjJjQ1eE34DTWvJsYbOc-qgpzF6yGJe1oYgjwSl8u0EKJon-q0xHynIfhAPxAFvedHconZbRAiudnbuTZMYmes2wGYbwncKW3D8RaPE6zn9mINJuDUdCELvvLj1TvsCswjvc6wZP3fDHcnAR2V47Oqi8DT2bfHRI91-XBOma73pHqwtglNMqnGoNIE1dnkDzDDfDlCU09DvoTmeoxR3qPgFkX3u3uL99w7oAbiiEkm32J3VYo5qz1DcndDOOkqxqS8Z5x6q_vhyQq1_f6br2NRjKozPmBkVvA4uvUVsVuCxhdyj0R1AdYN3DDUliux5UajzOY5_TstrlDREkvx069eT6cQDgZbRGXSuqn7GncNymtmTj5ugOgV2OODQNY18OXbnGYeWe0_fq4scMwMl4VrNrQ0PIDAAlM4_8-JElgQLFd8o5HOGE7m-bJqyBpbsNZwtWaR6Httms4iODoboMHNHcL6lOIde1n5i_tVOQYJ2i8Z4-x8K8-W0ApwUEGsYkmas3pgtFZ7L217_d1UDdp4GqTfcWjXbsjHbLOuREoN3sTjF-1kxC_-XZPyOKwfxZrcKPB9F1jrNFVylTVYT79pgTC6P2RwLzW4t2ogE";

// Global memory cache map
const memoryCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL
let isApiOffline = false;

function getCached(key: string) {
  const entry = memoryCache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

function setCached(key: string, data: unknown) {
  memoryCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}

export async function GET(req: Request) {
  const userApiKey = req.headers.get("x-printify-api-key");
  const activeToken = userApiKey || PRINTIFY_API_KEY;

  if (isApiOffline && !userApiKey) {
    return NextResponse.json({ error: "Printify API offline (Unauthorized 401 Cached)" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "blueprints") {
      const cachedData = getCached("blueprints");
      if (cachedData) {
        return NextResponse.json(cachedData);
      }

      const response = await fetch("https://api.printify.com/v1/catalog/blueprints.json", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Printify blueprints API returned status: ${response.status}`);
      }

      const blueprints = await response.json();
      setCached("blueprints", blueprints);
      return NextResponse.json(blueprints);
    }

    if (action === "blueprint-details") {
      const blueprintId = searchParams.get("blueprintId");
      if (!blueprintId) {
        return NextResponse.json({ error: "blueprintId is required" }, { status: 400 });
      }

      const cacheKey = `blueprint_details_${blueprintId}`;
      const cachedData = getCached(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }

      const response = await fetch(
        `https://api.printify.com/v1/catalog/blueprints/${blueprintId}.json`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Printify blueprint details API returned status: ${response.status}`);
      }

      const details = await response.json();
      setCached(cacheKey, details);
      return NextResponse.json(details);
    }

    if (action === "print-providers") {
      const blueprintId = searchParams.get("blueprintId");
      if (!blueprintId) {
        return NextResponse.json({ error: "blueprintId is required" }, { status: 400 });
      }

      const cacheKey = `print_providers_${blueprintId}`;
      const cachedData = getCached(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }

      const response = await fetch(
        `https://api.printify.com/v1/catalog/blueprints/${blueprintId}/print_providers.json`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Printify print-providers API returned status: ${response.status}`);
      }

      const providers = await response.json();
      setCached(cacheKey, providers);
      return NextResponse.json(providers);
    }

    if (action === "variants") {
      const blueprintId = searchParams.get("blueprintId");
      const providerId = searchParams.get("providerId");
      if (!blueprintId || !providerId) {
        return NextResponse.json({ error: "blueprintId and providerId are required" }, { status: 400 });
      }

      const cacheKey = `variants_${blueprintId}_${providerId}`;
      const cachedData = getCached(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }

      const response = await fetch(
        `https://api.printify.com/v1/catalog/blueprints/${blueprintId}/print_providers/${providerId}/variants.json`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Printify variants API returned status: ${response.status}`);
      }

      const variants = await response.json();
      setCached(cacheKey, variants);
      return NextResponse.json(variants);
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    if (errorMessage.includes("status: 401") || errorMessage.includes("status: 403")) {
      isApiOffline = true;
    }
    console.error("Printify proxy GET error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const userApiKey = req.headers.get("x-printify-api-key");
  const activeToken = userApiKey || PRINTIFY_API_KEY;
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "publish") {
      const body = await req.json();

      // 1. Fetch linked Printify shops list
      const shopsResponse = await fetch("https://api.printify.com/v1/shops.json", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          "Content-Type": "application/json",
        },
      });

      let shopId = null;
      if (shopsResponse.ok) {
        const shops = await shopsResponse.json();
        if (shops && shops.length > 0) {
          shopId = shops[0].id;
        }
      }

      if (!shopId) {
        shopId = "sandbox_shop_12345";
      }

      const isRealShop = !String(shopId).startsWith("sandbox");

      if (isRealShop) {
        // Post product details directly to the real Printify API
        const createProductRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: body.title,
            description: body.description,
            blueprint_id: parseInt(body.blueprintId),
            print_provider_id: parseInt(body.providerId),
            variants: body.variants || [],
            print_areas: body.printAreas || [],
          }),
        });

        if (!createProductRes.ok) {
          const errorText = await createProductRes.text();
          throw new Error(`Printify API creation failed: ${errorText}`);
        }

        const product = await createProductRes.json();
        return NextResponse.json({ success: true, shopId, product });
      }

      // Sandbox simulated response
      return NextResponse.json({
        success: true,
        simulated: true,
        shopId,
        product: {
          id: `printify_prod_${Math.random().toString(36).substr(2, 9)}`,
          title: body.title,
          description: body.description,
          blueprint_id: body.blueprintId,
          print_provider_id: body.providerId,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Printify proxy POST error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}
