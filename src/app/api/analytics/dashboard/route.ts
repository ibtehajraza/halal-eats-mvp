import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

async function checkAuth(req: Request) {
  const token = req.headers.get('cookie')?.match(/admin_token=([^;]+)/)?.[1];
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!await checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalVisitors,
    totalSessions,
    todayVisitors,
    weekVisitors,
    totalPageViews,
    avgSessionDuration,
    topRestaurants,
    conversionsByType,
    filterUsage,
    deviceBreakdown,
    recentEvents,
  ] = await Promise.all([
    prisma.visitor.count(),
    prisma.session.count(),
    prisma.session.count({ where: { startedAt: { gte: today } } }),
    prisma.session.count({ where: { startedAt: { gte: weekAgo } } }),
    prisma.analyticsEvent.count({ where: { eventType: 'page_view' } }),
    prisma.session.aggregate({ _avg: { duration: true }, where: { duration: { not: null } } }),
    prisma.restaurant.findMany({
      select: { id: true, name: true, totalViews: true, totalDirections: true, totalCalls: true, totalWebsiteClicks: true },
      orderBy: { totalViews: 'desc' },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where: { eventType: 'conversion' },
      _count: true,
    }),
    prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      where: { eventType: 'filter_use', timestamp: { gte: weekAgo } },
      _count: true,
    }),
    prisma.session.groupBy({
      by: ['device'],
      _count: true,
    }),
    prisma.analyticsEvent.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' },
      include: { restaurant: { select: { name: true } } },
    }),
  ]);

  return NextResponse.json({
    overview: {
      totalVisitors,
      totalSessions,
      todayVisitors,
      weekVisitors,
      totalPageViews,
      avgSessionDuration: Math.round(avgSessionDuration._avg.duration || 0),
    },
    topRestaurants,
    conversions: conversionsByType.map((c) => ({ name: c.eventName, count: c._count })),
    filterUsage: filterUsage.map((f) => ({ name: f.eventName, count: f._count })),
    deviceBreakdown: deviceBreakdown.map((d) => ({ device: d.device || 'unknown', count: d._count })),
    recentEvents: recentEvents.map((e) => ({
      id: e.id,
      visitorId: e.visitorId,
      type: e.eventType,
      name: e.eventName,
      page: e.page,
      restaurant: e.restaurant?.name,
      timestamp: e.timestamp,
      metadata: e.metadata,
    })),
  });
}
