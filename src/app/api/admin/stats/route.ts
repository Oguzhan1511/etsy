import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Basic auth check can be implemented here via cookies or JWT header
    // For now, we assume the frontend middleware checks the token role.

    // 1. Get total users and active premium users
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({ where: { paymentStatus: true } });

    // Constants for calculations
    const IYZICO_RATE = 0.0299;
    const IYZICO_FIXED = 0.25;
    const AI_TOKEN_COST_TL = 1.32; // Based on OpenAI DALL-E 3 $0.04 per image * 33 TL

    // 2. Gross Revenue & Iyzico calculations
    const transactions = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' }
    });
    const grossRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
    const iyzicoFees = transactions.reduce((acc, t) => acc + ((t.amount * IYZICO_RATE) + IYZICO_FIXED), 0);
    const netRevenue = grossRevenue - iyzicoFees;

    // 3. Tokens & AI Cost
    const allTokenUsages = await prisma.tokenUsage.findMany();
    const totalTokensSpent = allTokenUsages.reduce((acc, t) => acc + t.amount, 0);
    const aiCost = totalTokensSpent * AI_TOKEN_COST_TL;
    
    const netProfit = netRevenue - aiCost;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayUsages = allTokenUsages.filter(t => t.createdAt >= startOfDay);
    const tokensSpentToday = todayUsages.reduce((acc, t) => acc + t.amount, 0);

    // 4. Generate last 30 days revenue and token chart data using REAL database records
    const chartData = [];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentTransactions = transactions.filter(t => t.createdAt >= thirtyDaysAgo);
    const recentTokenUsages = allTokenUsages.filter(t => t.createdAt >= thirtyDaysAgo);

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      
      const dailyTransactions = recentTransactions.filter(t => 
        t.createdAt.getDate() === d.getDate() && 
        t.createdAt.getMonth() === d.getMonth()
      );
      
      const dailyTokenUsages = recentTokenUsages.filter(t => 
        t.createdAt.getDate() === d.getDate() && 
        t.createdAt.getMonth() === d.getMonth()
      );

      const dailyGross = dailyTransactions.reduce((acc, t) => acc + t.amount, 0);
      const dailyIyzico = dailyTransactions.reduce((acc, t) => acc + ((t.amount * IYZICO_RATE) + IYZICO_FIXED), 0);
      const dailyNetRev = dailyGross - dailyIyzico;
      
      const dailyTokens = dailyTokenUsages.reduce((acc, t) => acc + t.amount, 0);
      const dailyAiCost = dailyTokens * AI_TOKEN_COST_TL;
      
      const dailyNetProfit = dailyNetRev - dailyAiCost;

      chartData.push({
        name: dateString,
        revenue: dailyGross, // For backward compatibility in case frontend uses it
        netProfit: Number(dailyNetProfit.toFixed(2)),
        expense: Number((dailyIyzico + dailyAiCost).toFixed(2)),
        tokens: dailyTokens
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        premiumUsers,
        grossRevenue,
        iyzicoFees,
        aiCost,
        netProfit,
        tokensSpentToday,
        chartData
      }
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
