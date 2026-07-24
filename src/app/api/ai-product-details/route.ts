import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Lütfen giriş yapın.' }, { status: 401 });
    }

    let userId = '';
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.id as string;
    } catch (e) {
      return NextResponse.json({ error: 'Oturum süresi doldu.' }, { status: 401 });
    }

    // 2. Check token balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.tokens <= 0) {
      return NextResponse.json({ error: 'Yetersiz kredi.' }, { status: 403 });
    }

    const { referenceTitle, referenceDescription, referenceCategory, targetProductTitle } = await req.json();

    if (!referenceTitle) {
      return NextResponse.json({ error: 'Referans ürün başlığı eksik.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Key is missing in .env.local' }, { status: 500 });
    }

    const systemPrompt = `You are an expert Etsy SEO specialist and copywriter.
Your task is to generate a highly optimized product Title, Description, and a comma-separated list of exactly 13 Tags for a new Print-on-Demand product.
You will be provided with a reference successful Etsy product. You must extract the core successful keywords, aesthetic feel, and niche appeal from the reference product, but adapt them to fit the new target product.

Rules:
1. Title: Must be optimized for Etsy SEO (long-tail keywords separated by | or -), max 140 characters.
2. Description: Engaging, highlighting the aesthetic and use-case, incorporating keywords naturally. Should include bullet points for features if applicable. Keep it concise but persuasive (approx 150-250 words).
3. Tags: Exactly 13 tags, highly relevant, comma-separated. Each tag max 20 chars.
4. Output MUST be a valid JSON object with keys "title", "description", and "tags" (string). Do not return markdown blocks or anything outside the JSON.`;

    const userMessage = `Reference Product Category: ${referenceCategory || 'N/A'}
Reference Product Title: ${referenceTitle}
Reference Product Description (snippet): ${referenceDescription ? referenceDescription.substring(0, 300) : 'N/A'}

My New Target Product: ${targetProductTitle || 'A new Print-on-Demand item'}

Please generate the optimized Title, Description, and Tags (as a single comma-separated string) for My New Target Product based on the success profile of the reference product.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Error:", errorData);
      return NextResponse.json({ error: "OpenAI API hatası" }, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    try {
      const parsedResult = JSON.parse(resultText);

      // 3. Deduct token after successful generation
      await prisma.user.update({
        where: { id: userId },
        data: { tokens: { decrement: 1 } }
      });

      return NextResponse.json({
        title: parsedResult.title || '',
        description: parsedResult.description || '',
        tags: parsedResult.tags || ''
      });
    } catch (parseError) {
      console.error("Failed to parse JSON from OpenAI:", resultText);
      return NextResponse.json({ error: "Yapay zeka yanıtı anlaşılamadı." }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('AI Product Details Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
