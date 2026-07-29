import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/etsy';

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { views, favorites, salesCount, activeListings, revenue } = body;

    // Calculate today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Upsert today's stats
    const currentStat = await prisma.etsyDailyStat.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        views: views || 0,
        favorites: favorites || 0,
        salesCount: salesCount || 0,
        activeListings: activeListings || 0,
        revenue: revenue || 0,
      },
      create: {
        userId,
        date: today,
        views: views || 0,
        favorites: favorites || 0,
        salesCount: salesCount || 0,
        activeListings: activeListings || 0,
        revenue: revenue || 0,
      },
    });

    // Fetch historical data for Daily (yesterday), Weekly (7 days ago), Monthly (30 days ago)
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setUTCDate(lastWeek.getUTCDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setUTCDate(lastMonth.getUTCDate() - 30);

    const [statYesterday, statLastWeek, statLastMonth] = await Promise.all([
      prisma.etsyDailyStat.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
      prisma.etsyDailyStat.findFirst({
        where: { userId, date: { lte: lastWeek } },
        orderBy: { date: 'desc' },
      }),
      prisma.etsyDailyStat.findFirst({
        where: { userId, date: { lte: lastMonth } },
        orderBy: { date: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      currentStat,
      history: {
        yesterday: statYesterday,
        lastWeek: statLastWeek,
        lastMonth: statLastMonth,
      },
    });
  } catch (error: any) {
    console.error("Etsy stats sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
