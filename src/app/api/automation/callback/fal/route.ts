import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fal } from '@fal-ai/client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    const body = await req.json();
    console.log('fal.ai callback received:', JSON.stringify(body).slice(0, 200));

    const job = await prisma.videoJob.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    // fal.ai callback payload structure
    const status = body.status; // 'OK' | 'ERROR'
    
    if (status === 'ERROR') {
      await prisma.videoJob.update({
        where: { id: jobId },
        data: { status: 'failed', errorMessage: body.error?.message || 'fal.ai generation failed' },
      });
      return NextResponse.json({ ok: true });
    }

    // Get the actual result using request_id
    const requestId = job.falRequestId;
    if (!requestId) {
      await prisma.videoJob.update({ where: { id: jobId }, data: { status: 'failed', errorMessage: 'No fal request ID' } });
      return NextResponse.json({ ok: true });
    }

    fal.config({ credentials: process.env.FAL_AI_API_KEY || '' });
    const result = await fal.queue.result('fal-ai/kling-video/v2.1/standard/text-to-video', { requestId });
    
    // Extract video URL from result
    const resultData = result.data as Record<string, unknown>;
    const videoUrl =
      (resultData?.video as { url?: string })?.url ||
      (Array.isArray(resultData?.videos) ? (resultData.videos as { url: string }[])[0]?.url : undefined);

    if (!videoUrl) {
      await prisma.videoJob.update({ where: { id: jobId }, data: { status: 'failed', errorMessage: 'No video URL in fal result' } });
      return NextResponse.json({ ok: true });
    }

    // Mark as done (YouTube upload is manual for now)
    await prisma.videoJob.update({
      where: { id: jobId },
      data: {
        videoUrl,
        finalVideoUrl: videoUrl,
        status: 'done',
      },
    });

    console.log(`VideoJob ${jobId} completed. Video URL: ${videoUrl}`);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('fal callback error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
