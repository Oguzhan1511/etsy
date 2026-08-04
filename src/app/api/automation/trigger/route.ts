import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fal } from '@fal-ai/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Character DNA ───────────────────────────────────────────────────────────
const CHARACTER_DNA = `24 yaşında, modern kısa dalgalı koyu kahverengi saçlı, hafif kirli sakallı, 
üzerinde şık mat siyah oversize hoodie olan karizmatik genç Türk erkek girişimci. 
Arka plan koyu antrasit (#09090b). Aydınlatma neon mor (#8B5CF6) ve altın sarısı tonlarda.`;

// ─── Scenario Templates ───────────────────────────────────────────────────────
const SCENARIO_TYPES = [
  'problem_solution',
  'challenge',
  'secret_reveal',
  'before_after',
  'trend_reveal',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function generateScript(type: string): Promise<string> {
  const systemPrompt = `Sen PrintySell adlı yapay zeka destekli Print-on-Demand (Etsy + Printify otomasyon) 
  platformu için TikTok ve YouTube Shorts video senaryoları yazıyorsun. 
  Karakterimiz: ${CHARACTER_DNA}
  Platform renk paleti: Koyu antrasit (#09090b), neon mor (#8B5CF6), altın sarısı.
  Her senaryo iki bölüm halinde olmalı (her bölüm 6-7 saniye):
  - Bölüm 1: Sorun / Merak / Hook (izleyiciyi durduracak)
  - Bölüm 2: PrintySell ile çözüm / sonuç
  Türkçe, enerjik ve doğal bir dil kullan. Senaryo tipi: ${type}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Bu tipte (${type}) 13 saniyelik video için senaryo yaz. 
          Format:
          BÖLÜM_1_VİDEO: [Gemini/Kling için sinematik video prompt, karakter DNA dahil]
          BÖLÜM_1_SES: [ElevenLabs için seslendirme metni, max 20 kelime]
          BÖLÜM_2_VİDEO: [Gemini/Kling için sinematik video prompt, karakter DNA dahil]
          BÖLÜM_2_SES: [ElevenLabs için seslendirme metni, max 20 kelime]
          BAŞLIK: [YouTube/TikTok başlığı]
          ETİKETLER: [10 adet hashtag]`,
        },
      ],
      max_tokens: 800,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function generateVoiceover(text: string): Promise<string | null> {
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  if (!elevenKey) return null;

  // Extract ses lines from script
  const sesMatches = text.match(/BÖLÜM_\d_SES: (.+)/g) || [];
  const combinedText = sesMatches
    .map(m => m.replace(/BÖLÜM_\d_SES: /, '').trim())
    .join(' ... ');

  if (!combinedText) return null;

  // Use Adam voice (most TikTok-friendly Turkish voice)
  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': elevenKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: combinedText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.78,
        style: 0.18,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) return null;

  // Convert to base64 for storage
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:audio/mpeg;base64,${base64}`;
}

async function queueVideoGeneration(
  jobId: string,
  videoPrompt: string,
): Promise<string | null> {
  const falKey = process.env.FAL_AI_API_KEY;
  if (!falKey) return null;

  fal.config({ credentials: falKey });

  // Extract video prompts from script
  const promptLines = videoPrompt.match(/BÖLÜM_\d_VİDEO: (.+)/g) || [];
  const combinedPrompt = promptLines
    .map(p => p.replace(/BÖLÜM_\d_VİDEO: /, '').trim())
    .join('. Then: ');

  const finalPrompt = combinedPrompt || videoPrompt;

  try {
    // Use fal.ai queue for async generation
    const { request_id } = await fal.queue.submit('fal-ai/kling-video/v2.1/standard/text-to-video', {
      input: {
        prompt: finalPrompt,
        duration: '10',
        aspect_ratio: '9:16', // TikTok/Shorts vertical format
      },
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/automation/callback/fal?jobId=${jobId}`,
    });

    return request_id;
  } catch (err) {
    console.error('fal.ai queue error:', err);
    return null;
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Security: Only allow from Vercel Cron or admin
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'printysell_cron_secret';
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Pick a random scenario type
    const scenarioType = SCENARIO_TYPES[Math.floor(Math.random() * SCENARIO_TYPES.length)];

    // Create job record
    const job = await prisma.videoJob.create({
      data: { status: 'generating_script' },
    });

    // Step 1: Generate script
    const script = await generateScript(scenarioType);
    await prisma.videoJob.update({
      where: { id: job.id },
      data: { script, status: 'generating_audio' },
    });

    // Step 2: Generate voiceover (ElevenLabs)
    const voiceoverUrl = await generateVoiceover(script);
    await prisma.videoJob.update({
      where: { id: job.id },
      data: {
        voiceoverUrl: voiceoverUrl || undefined,
        status: 'generating_video',
      },
    });

    // Step 3: Queue video generation (fal.ai async)
    const falRequestId = await queueVideoGeneration(job.id, script);
    await prisma.videoJob.update({
      where: { id: job.id },
      data: {
        falRequestId: falRequestId || undefined,
        status: falRequestId ? 'generating_video' : 'failed',
        errorMessage: falRequestId ? undefined : 'fal.ai queue failed - check FAL_AI_API_KEY',
      },
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      scenarioType,
      hasVoiceover: !!voiceoverUrl,
      falRequestId,
      message: falRequestId
        ? 'Video generation queued. fal.ai will call back when ready.'
        : 'Script and audio generated. Video queuing failed.',
    });
  } catch (err: unknown) {
    console.error('Automation trigger error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// GET: Manual trigger from admin panel
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (secret !== (process.env.CRON_SECRET || 'printysell_cron_secret')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fake a POST request internally
  return POST(
    new Request(req.url, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.CRON_SECRET || 'printysell_cron_secret'}` },
    }),
  );
}
