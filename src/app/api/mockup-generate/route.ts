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

    let userId = '';
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
      } catch {
        // invalid token
      }
    }

    const body = await req.json();
    const { 
      designImage, 
      productType = 'tshirt', 
      modelGender = 'female', 
      color = 'white', 
      environment = 'studio',
      customPrompt = '',
      userId: bodyUserId
    } = body;

    // Fallback: check header or body
    if (!userId) {
      userId = req.headers.get('x-user-id') || bodyUserId || '';
    }

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      // Fallback to active admin
      user = await prisma.user.findFirst({ where: { role: 'ADMIN' } }) || await prisma.user.findFirst();
      if (user) userId = user.id;
    }

    if (!user || user.tokens < 3) {
      return NextResponse.json({ 
        error: `Yetersiz token. 3 adet canlı mockup seti üretmek için en az 3 Token gereklidir. Mevcut: ${user?.tokens || 0}` 
      }, { status: 403 });
    }

    if (!designImage) {
      return NextResponse.json({ error: 'Lütfen uygulanacak tasarımı seçin veya yükleyin.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Anahtarı eksik.' }, { status: 500 });
    }

    // Map selections to rich descriptors
    const productLabels: Record<string, string> = {
      tshirt: 'crewneck t-shirt',
      oversized_tshirt: 'oversized streetwear t-shirt',
      hoodie: 'premium heavy blend pullover hoodie',
      sweatshirt: 'classic crewneck sweatshirt',
      cap: 'structured baseball cap dad hat',
      totebag: 'canvas tote bag with sturdy handles',
      mug: 'glossy ceramic coffee mug',
      pillow: 'square decorative throw pillow',
      tanktop: 'sleeveless cotton tank top'
    };

    const genderLabels: Record<string, string> = {
      female: 'beautiful young female model',
      male: 'handsome young male model',
      unisex: 'stylish modern unisex fashion model'
    };

    const envLabels: Record<string, string> = {
      studio: 'minimalist high-end studio with clean soft shadows and neutral beige backdrop',
      urban_street: 'vibrant sunlit city street with modern urban architecture and soft bokeh',
      aesthetic_cafe: 'cozy sunlit Scandinavian coffee shop with warm ambient lighting',
      nature_outdoor: 'golden hour outdoor scenic park with soft lens flare and lush green nature'
    };

    const colorLabels: Record<string, string> = {
      white: 'crisp solid white',
      black: 'deep solid black',
      sand: 'sand natural cream',
      beige: 'aesthetic soft oatmeal beige',
      heather_grey: 'athletic heather grey',
      charcoal: 'dark charcoal heather grey',
      navy: 'classic dark navy blue',
      royal_blue: 'vibrant royal blue',
      light_blue: 'pastel baby blue',
      forest_green: 'deep forest green',
      military_green: 'military olive khaki green',
      sage_green: 'soft pastel sage green',
      maroon: 'rich maroon burgundy',
      red: 'classic vibrant red',
      pink: 'soft pastel light pink',
      dusty_rose: 'vintage dusty rose pink',
      brown: 'warm chocolate brown',
      mustard: 'vintage mustard gold yellow',
      terracotta: 'warm rustic terracotta orange',
      lavender: 'aesthetic pastel lavender lilac',
    };

    const selectedProduct = productLabels[productType] || 't-shirt';
    const selectedGender = genderLabels[modelGender] || 'fashion model';
    const selectedEnv = envLabels[environment] || 'bright aesthetic studio';
    const selectedColor = colorLabels[color] || color || 'solid white';

    // 3 distinct prompt variations tailored to product type (cap, totebag, mug, pillow, apparel)
    let prompt1 = '';
    let prompt2 = '';
    let prompt3 = '';

    if (productType === 'cap') {
      prompt1 = `Professional commercial fashion e-commerce mockup photograph: A ${selectedGender} wearing a stylish ${selectedColor} baseball cap hat on their head, displaying this exact graphic design printed or embroidered cleanly and vividly centered on the front crown of the cap. Studio portrait shot, head and shoulders framing, authentic realistic cotton twill fabric texture, structured curved brim, flawless studio lighting, crisp 8k detail, Etsy best seller apparel showcase. ${customPrompt ? `Note: ${customPrompt}` : ''}`;
      prompt2 = `Lifestyle e-commerce catalog photograph: A trendy ${selectedGender} wearing a ${selectedColor} baseball cap with this exact graphic print on the front of the hat, photographed candidly in a ${selectedEnv}. Dynamic 3/4 angle pose, natural sunlight, depth of field, photorealistic cotton cap texture, hyperrealistic live model photography.`;
      prompt3 = `Editorial lookbook close-up photograph: Detailed medium close-up of the ${selectedColor} baseball cap hat worn by the ${selectedGender}, showing the high-resolution printed graphic design centered on the front crown of the cap, realistic woven twill texture and stitching, aesthetic warm grading, stylish magazine quality.`;
    } else if (productType === 'totebag') {
      prompt1 = `Professional commercial fashion e-commerce mockup photograph: A ${selectedGender} holding and showcasing a ${selectedColor} ${selectedProduct} displaying this exact graphic design printed vividly on the front. Studio portrait shot, authentic canvas fabric texture, natural wrinkles, flawless studio lighting, crisp 8k detail, Etsy best seller showcase. ${customPrompt ? `Note: ${customPrompt}` : ''}`;
      prompt2 = `Lifestyle e-commerce catalog photograph: A trendy ${selectedGender} carrying a ${selectedColor} ${selectedProduct} with this exact graphic print on it, photographed candidly in a ${selectedEnv}. Dynamic 3/4 angle pose, natural sunlight, depth of field, photorealistic canvas texture, hyperrealistic live model photography.`;
      prompt3 = `Editorial lookbook close-up photograph: Detailed medium close-up of the ${selectedColor} ${selectedProduct} held by the ${selectedGender}, showing the high-resolution printed graphic design centered on the tote bag, realistic woven fabric texture, aesthetic warm grading, stylish magazine quality.`;
    } else if (productType === 'mug') {
      prompt1 = `Professional commercial e-commerce mockup photograph: A ${selectedGender} holding and showcasing a ${selectedColor} ${selectedProduct} displaying this exact graphic design printed vividly on the side of the mug. Studio portrait shot, authentic glossy ceramic texture, flawless studio lighting, crisp 8k detail, Etsy best seller showcase. ${customPrompt ? `Note: ${customPrompt}` : ''}`;
      prompt2 = `Lifestyle e-commerce catalog photograph: A ${selectedGender} holding a steaming ${selectedColor} coffee mug with this exact graphic print on it, photographed candidly in a ${selectedEnv}. Natural sunlight, depth of field, photorealistic ceramic gloss, hyperrealistic live model photography.`;
      prompt3 = `Editorial lookbook close-up photograph: Detailed close-up of the ${selectedColor} ${selectedProduct} held in hands, showing the high-resolution printed graphic design centered on the ceramic surface, aesthetic warm grading, stylish magazine quality.`;
    } else if (productType === 'pillow') {
      prompt1 = `Professional commercial home decor e-commerce mockup photograph: An aesthetic ${selectedColor} ${selectedProduct} displaying this exact graphic design printed vividly across the front pillow cover, styled on a luxury designer sofa. Studio shot, authentic soft fabric texture, natural wrinkles, flawless lighting, crisp 8k detail. ${customPrompt ? `Note: ${customPrompt}` : ''}`;
      prompt2 = `Lifestyle e-commerce catalog photograph: A ${selectedGender} relaxing in a ${selectedEnv} next to an aesthetic ${selectedColor} decorative pillow with this exact graphic print on it. Natural sunlight, depth of field, photorealistic fabric texture, cozy aesthetic interior.`;
      prompt3 = `Editorial lookbook close-up photograph: Detailed macro close-up of the ${selectedColor} throw pillow, showing the high-resolution printed graphic design centered on the linen fabric, authentic stitching, aesthetic warm grading, stylish magazine quality.`;
    } else {
      // Apparel (tshirt, oversized_tshirt, hoodie, sweatshirt, tanktop)
      prompt1 = `Professional commercial fashion e-commerce mockup photograph: A ${selectedGender} wearing a ${selectedColor} ${selectedProduct} displaying this exact graphic design printed vividly on the front chest. Studio portrait shot, straight-on view, authentic realistic fabric texture, natural wrinkles, flawless studio lighting, crisp 8k detail, Etsy best seller apparel showcase. ${customPrompt ? `Note: ${customPrompt}` : ''}`;
      prompt2 = `Lifestyle e-commerce catalog photograph: A trendy ${selectedGender} wearing a ${selectedColor} ${selectedProduct} with this exact graphic print on it, photographed candidly in a ${selectedEnv}. Dynamic 3/4 angle pose, natural sunlight, depth of field, photorealistic fabric draping, hyperrealistic live model photography.`;
      prompt3 = `Editorial lookbook close-up photograph: Detailed medium close-up of the ${selectedColor} ${selectedProduct} worn by the ${selectedGender}, showing the high-resolution printed graphic design centered on the chest, realistic woven cotton texture, aesthetic warm grading, stylish magazine quality.`;
    }

    // Prepare image buffer
    let buffer: Buffer;
    let mimeType = 'image/png';
    let ext = 'png';

    if (designImage.startsWith('http://') || designImage.startsWith('https://')) {
      const imgRes = await fetch(designImage);
      if (!imgRes.ok) {
        return NextResponse.json({ error: 'Tasarım görseli indirilemedi.' }, { status: 400 });
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = imgRes.headers.get('content-type') || 'image/png';
      ext = mimeType.split('/')[1] || 'png';
    } else {
      const base64Data = designImage.includes(',') ? designImage.split(',')[1] : designImage;
      const mimeMatch = designImage.match(/^data:(image\/\w+);base64,/);
      mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      ext = mimeType.split('/')[1] || 'png';
      buffer = Buffer.from(base64Data, 'base64');
    }

    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });

    // Helper to request 1 image edit from OpenAI
    const generateSingleMockup = async (promptText: string) => {
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('image', blob, `design.${ext}`);
      formData.append('prompt', promptText);
      formData.append('input_fidelity', 'high');
      formData.append('background', 'opaque');
      formData.append('quality', 'high');
      formData.append('size', '1024x1024');
      formData.append('n', '1');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI Mockup Error:", errorText);
        throw new Error(`OpenAI API Hatası: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && data.data[0]) {
        const resObj = data.data[0];
        if (resObj.b64_json) {
          return `data:image/png;base64,${resObj.b64_json}`;
        }
        if (resObj.url) {
          return resObj.url;
        }
      }
      throw new Error("Görsel üretilemedi");
    };

    // Execute 3 generations in parallel
    const results = await Promise.allSettled([
      generateSingleMockup(prompt1),
      generateSingleMockup(prompt2),
      generateSingleMockup(prompt3)
    ]);

    const generatedUrls: string[] = [];
    results.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        generatedUrls.push(res.value);
      } else {
        console.error(`Mockup ${index + 1} failed:`, res.reason);
      }
    });

    if (generatedUrls.length === 0) {
      return NextResponse.json({ error: 'Görseller üretilemedi, lütfen tekrar deneyin.' }, { status: 500 });
    }

    // Deduct 3 tokens upon successful generation
    const tokenCost = 3;
    await prisma.user.update({
      where: { id: userId },
      data: { tokens: { decrement: tokenCost } }
    });

    // Return the generated mockups array
    return NextResponse.json({
      success: true,
      mockups: generatedUrls,
      tokensUsed: tokenCost,
      remainingTokens: (user.tokens - tokenCost)
    });

  } catch (error: unknown) {
    console.error('Mockup Generation Server Error:', error);
    const msg = error instanceof Error ? error.message : 'Sunucu hatası oluştu';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
