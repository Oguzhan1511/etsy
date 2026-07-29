import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';
import { sendTelegramMessage } from '@/lib/telegram';



export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi ile zaten bir hesap mevcut.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a secure random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save the user to the database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        verificationToken,
      },
    });

    // Send Telegram Notification
    await sendTelegramMessage(
      `🎉 <b>YENİ ÖN KAYIT (WAITLIST)</b>\n\n👤 <b>İsim:</b> ${user.name}\n📧 <b>E-posta:</b> ${user.email}\n\n<i>Sistemde başarıyla rezerve edildi!</i>`
    );

    // Send the verification email using Resend
    // We construct the verification link based on the request origin (works for both local and prod)
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    const verifyLink = `${origin}/verify?token=${verificationToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: 'PrintySell <destek@printysell.com>',
      to: [user.email],
      subject: '🚀 PrintySell Ailesine Hoş Geldiniz!',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 40px 20px; border-radius: 16px; border: 1px solid #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #a855f7; font-size: 28px; margin: 0;">PrintySell</h1>
            <p style="color: #888; font-size: 14px; margin-top: 5px; letter-spacing: 2px; text-transform: uppercase;">Erken Erişim Bekleme Listesi</p>
          </div>
          
          <div style="background-color: #111; padding: 30px; border-radius: 12px; border: 1px solid #222;">
            <h2 style="color: #fff; font-size: 22px; margin-top: 0;">Merhaba ${user.name},</h2>
            <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
              PrintySell erken erişim bekleme listesine hoş geldiniz! Ön kaydınız başarıyla alındı.
            </p>
            <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
              Sistemimiz çok yakında tam sürüm olarak hizmete açılacaktır. Erken erişim fırsatından yararlandığınız için hesabınıza <strong>50 Token (50 Farklı Yapay Zeka Görseli)</strong> üretim hakkı tamamen ücretsiz olarak tanımlanmıştır!
            </p>
            <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
              Platform kapılarını açtığında size tekrar e-posta ile haber vereceğiz ve hemen tasarımlarınızı üretip Etsy'de satmaya başlayabileceksiniz.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #7c6af7 0%, #a855f7 100%); color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);">
                50 Token Hesabınıza Rezerve Edildi 🎁
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #555; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} PrintySell. Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend Email Error:', emailError);
      // We still return success but maybe log the error, so the user is registered but we'll need a way to resend
    }

    return NextResponse.json({ success: true, message: 'Kayıt başarılı. Lütfen e-postanızı kontrol edin.' });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Kayıt olurken bir sunucu hatası oluştu.', details: error.message }, { status: 500 });
  }
}
