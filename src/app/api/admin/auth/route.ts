import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'printysell_master';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Pr!nty$ell_2026_xQ9#';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a response
      const response = NextResponse.json({ success: true, message: 'Firewall aşıldı. Giriş başarılı.' });
      
      // Set a secure HTTP-Only cookie to maintain the admin session
      response.cookies.set('printysell_admin_token', 'secure_admin_session_active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Geçersiz yetki.' }, { status: 401 });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// Allow admin to logout via firewall
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı.' });
  response.cookies.delete('printysell_admin_token');
  return response;
}
