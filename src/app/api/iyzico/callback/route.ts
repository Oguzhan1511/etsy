import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// @ts-ignore
import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-dummy-api-key',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-dummy-secret-key',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/checkout?error=missing_token`);
    }

    // Retrieve payment result from Iyzico
    return new Promise<NextResponse>((resolve) => {
      iyzipay.checkoutForm.retrieve({ token, locale: Iyzipay.LOCALE.TR }, async (err: any, result: any) => {
        if (err || result.status === 'failure') {
          console.error("Iyzico Retrieve Error:", err || result.errorMessage);
          return resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/checkout?error=payment_failed`));
        }

        // Check if payment status is SUCCESS
        if (result.paymentStatus === 'SUCCESS') {
          // In the checkout init, we passed the userId inside buyer.id. But Iyzico retrieves it in result.basketId or result.buyer
          // Let's parse conversationId which we set as CONV-{userId}-{timestamp}
          const conversationId = result.conversationId as string;
          const userId = conversationId.split('-')[1];

          if (userId) {
            // Update user in DB
            await prisma.user.update({
              where: { id: userId },
              data: {
                plan: 'Pro',
                tokens: { increment: 90 }, // Grant 90 tokens
                paymentStatus: true
              }
            });
            // Redirect to dashboard with success message
            return resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/dashboard?payment=success`));
          }
        }
        
        // Fallback error redirect
        return resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/checkout?error=unknown`));
      });
    });

  } catch (error) {
    console.error("Iyzico Callback Error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/checkout?error=server_error`);
  }
}
