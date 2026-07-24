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

    // 2. Total revenue from successful transactions
    const transactions = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' }
    });
    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

    // 3. Tokens spent today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const tokenUsages = await prisma.tokenUsage.findMany({
      where: { createdAt: { gte: startOfDay } }
    });
    const tokensSpentToday = tokenUsages.reduce((acc, t) => acc + t.amount, 0);

    // 4. Generate last 30 days revenue and token chart data
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      
      // Simulate/calculate data for that day (Mocking for now to show beautiful graphs)
      chartData.push({
        name: dateString,
        revenue: Math.floor(Math.random() * 5000) + 1000, // Replace with actual aggregation
        tokens: Math.floor(Math.random() * 500) + 50
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        premiumUsers,
        totalRevenue,
        tokensSpentToday,
        chartData
      }
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
