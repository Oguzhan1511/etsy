import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    if (!base64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('file', blob, 'image.png');

    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.status === 'success' && data.data?.url) {
      // Convert https://tmpfiles.org/12345/image.png to https://tmpfiles.org/dl/12345/image.png
      const directUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      return NextResponse.json({ url: directUrl });
    }

    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
