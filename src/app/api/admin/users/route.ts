import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ideally add JWT or cookie check for ADMIN role here
    
    // Fetch all users with basic details
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        tokens: true,
        paymentStatus: true,
        isVerified: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, users });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

// POST endpoint for admin actions (adding tokens, changing plans)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, amount, newPlan } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    let updatedUser;

    switch (action) {
      case 'ADD_TOKENS':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { tokens: { increment: amount || 0 } }
        });
        break;
      
      case 'SET_PLAN':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { plan: newPlan, paymentStatus: newPlan !== 'none' }
        });
        break;
        
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
