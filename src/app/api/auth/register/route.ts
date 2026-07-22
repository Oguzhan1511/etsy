import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send the verification email using Resend
    // We construct the verification link based on the request origin (works for both local and prod)
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    const verifyLink = `${origin}/verify?token=${verificationToken}`;

    const { error: emailError } = await resend.emails.send({
      from: 'PrintySell <onboarding@resend.dev>', // If you add a custom domain to Resend, change this
      to: [user.email],
      subject: 'PrintySell Hesabınızı Doğrulayın',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #8b5cf6;">PrintySell'e Hoş Geldiniz!</h1>
          <p>Merhaba ${user.name},</p>
          <p>Kayıt olduğunuz için teşekkür ederiz. Lütfen hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
            Hesabımı Doğrula
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Eğer butona tıklayamazsanız, bu linki tarayıcınıza kopyalayabilirsiniz:<br/>
            ${verifyLink}
          </p>
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
