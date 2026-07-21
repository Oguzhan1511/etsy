import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { base64Image, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Key is missing in .env.local' }, { status: 500 });
    }

    let dallePrompt = prompt;

    // If an image is provided, use GPT-4o to analyze it and write a DALL-E 3 prompt
    if (base64Image) {
      const gpt4Response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert prompt engineer for DALL-E 3. Your goal is to look at the user\'s uploaded design, and write a DALL-E 3 prompt that EXACTLY recreates the style, layout, aesthetics, and subject of the uploaded design, but incorporates the user\'s requested modifications. DO NOT output conversational text, ONLY output the final DALL-E 3 english prompt. Ensure the background is white so it can be easily removed later.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: `User request: ${prompt}. Describe this image perfectly so DALL-E 3 can recreate it with the requested changes.` },
                { type: 'image_url', image_url: { url: base64Image } }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      if (gpt4Response.ok) {
        const gpt4Data = await gpt4Response.json();
        if (gpt4Data.choices?.[0]?.message?.content) {
          dallePrompt = gpt4Data.choices[0].message.content;
          console.log("GPT-4o generated DALL-E prompt:", dallePrompt);
        }
      }
    }

    // Now call DALL-E 3
    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: dallePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
      })
    });

    if (!dalleResponse.ok) {
      const errorData = await dalleResponse.json();
      console.error("DALL-E 3 Error:", errorData);
      return NextResponse.json({ error: errorData.error?.message || 'Failed to generate image' }, { status: 500 });
    }

    const dalleData = await dalleResponse.json();
    return NextResponse.json({ url: dalleData.data[0].url });

  } catch (error: unknown) {
    console.error('OpenAI Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
