import { NextResponse } from 'next/server';
import { uploadDesignToSupabase } from '@/lib/supabase-storage';

export async function POST(req: Request) {
  try {
    const { base64, userId } = await req.json();
    if (!base64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const folderId = userId || 'default_user';
    const publicUrl = await uploadDesignToSupabase(base64, folderId);

    if (publicUrl) {
      return NextResponse.json({ url: publicUrl });
    }

    return NextResponse.json({ error: 'Supabase upload failed' }, { status: 500 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
