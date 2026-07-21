import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { base64Image, prompt } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: 'Lütfen bir referans görsel yükleyin.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Key is missing in .env.local' }, { status: 500 });
    }

    // Harika prompt şablonunu kullanıyoruz
    const fullPrompt = `Extract and isolate ONLY the print/pattern design from this image, removing the garment, model, fabric folds, shadows, and any clothing texture entirely. Present the design as a standalone flat print asset, photographed straight-on with even studio lighting, as if for a print-on-demand catalog. Preserve the exact composition, element positions, color palette, and artistic style of the original design with maximum fidelity - do not reinterpret, simplify, or stylize differently. Background must be solid, flat, pure white (#FFFFFF), completely uniform with no gradient, texture, vignette, or shadow. No mockup, no fabric, no text, no watermark.
Kullanıcı talimatı: ${prompt}`;

    // Base64'ü form-data için Blob/File formatına çevir
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const mimeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext = mimeType.split('/')[1] || 'png';
    
    // Buffer for Node.js environment
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: mimeType });

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('image', blob, `image.${ext}`);
    formData.append('prompt', fullPrompt);
    formData.append('input_fidelity', 'high');
    formData.append('background', 'opaque');
    formData.append('quality', 'high');
    formData.append('size', '1024x1024');
    formData.append('n', '1');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Error:", errorData);
      let errMsg = "OpenAI API hatası";
      try {
        const parsed = JSON.parse(errorData);
        errMsg = parsed.error?.message || errMsg;
      } catch {}
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ url: data.data[0].url });

  } catch (error: unknown) {
    console.error('OpenAI Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
