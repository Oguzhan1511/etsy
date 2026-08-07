import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ideally add JWT or cookie check for ADMIN role here
    
    // Fetch all users with token usages
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
        tokenUsages: {
          select: {
            id: true,
            amount: true,
            actionType: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const AI_TOKEN_COST_TL = 1.32; // ~0.04$ * 33 TL

    let totalTokensSpent = 0;
    let totalTokensRemaining = 0;

    const mappedUsers = users.map(u => {
      const spent = u.tokenUsages.reduce((acc, usage) => acc + usage.amount, 0);
      totalTokensSpent += spent;
      totalTokensRemaining += u.tokens;

      // Group by action type
      const breakdown: Record<string, number> = {};
      u.tokenUsages.forEach(usage => {
        const type = usage.actionType || 'diger';
        breakdown[type] = (breakdown[type] || 0) + usage.amount;
      });

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.plan,
        tokens: u.tokens,
        spentTokens: spent,
        estimatedCostTL: Number((spent * AI_TOKEN_COST_TL).toFixed(2)),
        estimatedCostUSD: Number((spent * 0.04).toFixed(2)),
        usageBreakdown: breakdown,
        recentUsages: u.tokenUsages.slice(0, 10),
        paymentStatus: u.paymentStatus,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ 
      success: true, 
      users: mappedUsers,
      summary: {
        totalUsers: users.length,
        totalTokensSpent,
        totalTokensRemaining,
        totalEstimatedCostTL: Number((totalTokensSpent * AI_TOKEN_COST_TL).toFixed(2)),
        totalEstimatedCostUSD: Number((totalTokensSpent * 0.04).toFixed(2)),
      }
    });
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
