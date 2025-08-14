import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const today = startOfDay(new Date());
    const windowEnd = addDays(today, 7); // exclusive

    // Upcoming due schedule (next 7 days)
    const upcoming = await prisma.lexemeState.findMany({
      where: {
        userId,
        suspended: false,
        due: {
          gte: today,
          lt: windowEnd,
        },
      },
      include: { lexeme: true },
      orderBy: { due: 'asc' },
    });

    const scheduleMap = new Map<string, { count: number; items: Array<{ lexemeId: string; lemma: string; due: string }> }>();
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      scheduleMap.set(formatISODate(date), { count: 0, items: [] });
    }

    for (const s of upcoming) {
      const key = formatISODate(startOfDay(s.due));
      const bucket = scheduleMap.get(key);
      if (bucket) {
        bucket.count += 1;
        if (bucket.items.length < 10) {
          bucket.items.push({ lexemeId: s.lexemeId, lemma: s.lexeme.lemma, due: s.due.toISOString() });
        }
      }
    }

    const schedule = Array.from(scheduleMap.entries()).map(([date, v]) => ({ date, count: v.count, sample: v.items }));

    const dueToday = schedule[0]?.count || 0;
    const due7days = schedule.reduce((acc, d) => acc + d.count, 0);

    // Reviews in the last 7 days
    const from7 = addDays(today, -6);
    const reviews7 = await prisma.review.findMany({
      where: {
        userId,
        reviewedAt: { gte: from7 },
      },
      orderBy: { reviewedAt: 'asc' },
    });

    const reviewsMap = new Map<string, { count: number; goodOrEasy: number; sum: number }>();
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, -i);
      reviewsMap.set(formatISODate(date), { count: 0, goodOrEasy: 0, sum: 0 });
    }

    let totalCount = 0;
    let goodOrEasyTotal = 0;
    let sumRatings = 0;

    for (const r of reviews7) {
      const key = formatISODate(startOfDay(r.reviewedAt));
      const bucket = reviewsMap.get(key) || { count: 0, goodOrEasy: 0, sum: 0 };
      bucket.count += 1;
      bucket.sum += r.rating;
      if (r.rating >= 3) bucket.goodOrEasy += 1;
      reviewsMap.set(key, bucket);
      totalCount += 1;
      sumRatings += r.rating;
      if (r.rating >= 3) goodOrEasyTotal += 1;
    }

    const byDay = Array.from(reviewsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({
        date,
        count: v.count,
        retention: v.count ? Math.round((v.goodOrEasy / v.count) * 100) : 0,
      }));

    const retention7d = totalCount ? Math.round((goodOrEasyTotal / totalCount) * 100) : 0;
    const avgRating7d = totalCount ? Number((sumRatings / totalCount).toFixed(2)) : 0;

    // Streak (consecutive days with >=1 review), check up to 30 days back
    const from30 = addDays(today, -30);
    const last30 = await prisma.review.findMany({
      where: { userId, reviewedAt: { gte: from30 } },
      select: { reviewedAt: true },
    });
    const daysSet = new Set(last30.map(r => formatISODate(startOfDay(r.reviewedAt))));
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const date = addDays(today, -i);
      const key = formatISODate(date);
      if (daysSet.has(key)) streak += 1; else break;
    }

    return NextResponse.json({
      totals: { dueToday, due7days, totalReviews7d: totalCount, retention7d, avgRating7d, streak },
      reviews: { byDay },
      schedule,
    });
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}