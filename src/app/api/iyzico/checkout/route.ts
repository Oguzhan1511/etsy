import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
// @ts-ignore
import Iyzipay from 'iyzipay';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-dummy-api-key',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-dummy-secret-key',
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = '';
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.id as string;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { plan } = await req.json(); // e.g. "Pro"
    if (!plan || plan !== "Pro") {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const price = "299.00"; // Fake price for the Pro Plan in TRY

    // Iyzico Request Payload
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `CONV-${user.id}-${Date.now()}`,
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `BASKET-${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/api/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: user.id,
        name: user.name.split(' ')[0] || 'John',
        surname: user.name.split(' ').slice(1).join(' ') || 'Doe',
        gsmNumber: '+905555555555',
        email: user.email,
        identityNumber: '11111111111',
        lastLoginDate: '2023-01-01 12:00:00',
        registrationDate: '2023-01-01 12:00:00',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      billingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      basketItems: [
        {
          id: 'ITEM-PRO-PLAN',
          name: 'PrintySell Pro Plan',
          category1: 'Software',
          category2: 'SaaS',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: price
        }
      ]
    };

    return new Promise<NextResponse>((resolve) => {
      iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          console.error("Iyzico Init Error:", err);
          resolve(NextResponse.json({ error: 'Iyzico bağlantı hatası' }, { status: 500 }));
        } else if (result.status === "failure") {
          console.error("Iyzico Failure:", result.errorMessage);
          resolve(NextResponse.json({ error: result.errorMessage }, { status: 400 }));
        } else {
          // result.checkoutFormContent contains the HTML/JS for the modal
          resolve(NextResponse.json({ 
            success: true, 
            checkoutFormContent: result.checkoutFormContent,
            token: result.token
          }));
        }
      });
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
  }
}
