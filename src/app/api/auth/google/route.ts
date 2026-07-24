import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OAuth2Client } from 'google-auth-library';
import { Resend } from 'resend';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'No credential provided' }, { status: 400 });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 400 });
    }

    const { email, name, sub: googleId } = payload;
    const lowerEmail = email.toLowerCase();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (user) {
      // If user exists but doesn't have googleId, we can link it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email: lowerEmail },
          data: { googleId, authProvider: 'google' },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: lowerEmail,
          name: name || 'Google User',
          password: '', // Empty password since it's OAuth
          authProvider: 'google',
          googleId,
          isVerified: true, // Google accounts are already verified
        },
      });

      // Send Welcome Email
      try {
        const origin = new URL(req.url).origin;
        await resend.emails.send({
          from: 'PrintySell <destek@printysell.com>',
          to: [user.email],
          subject: '🚀 PrintySell Ailesine Hoş Geldiniz! (Google)',
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 40px 20px; border-radius: 16px; border: 1px solid #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #a855f7; font-size: 28px; margin: 0;">PrintySell</h1>
                <p style="color: #888; font-size: 14px; margin-top: 5px; letter-spacing: 2px; text-transform: uppercase;">Yapay Zeka Destekli B2B SaaS</p>
              </div>
              
              <div style="background-color: #111; padding: 30px; border-radius: 12px; border: 1px solid #222;">
                <h2 style="color: #fff; font-size: 22px; margin-top: 0;">Merhaba ${user.name},</h2>
                <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
                  PrintySell dünyasına adım attığınız için teşekkür ederiz. Hesabınız Google üzerinden başarıyla oluşturuldu.
                </p>
                <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
                  Hemen panele girerek kendi Printify mağazanızı yönetmeye ve otomatik tasarımlarla satış yapmaya başlayabilirsiniz!
                </p>
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${origin}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c6af7 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; font-size: 16px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);">
                    Panele Git
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; color: #555; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} PrintySell. Tüm hakları saklıdır.</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send Google welcome email', emailErr);
      }
    }

    // Since we're using a custom auth setup on the frontend with localStorage (printysell-auth-user),
    // we return the user object so the frontend can set the session just like a normal login.
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        printifyToken: user.printifyToken
      }
    });

  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Kimlik doğrulama sırasında bir hata oluştu.' }, { status: 500 });
  }
}
