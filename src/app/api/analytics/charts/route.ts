import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

async function checkAuth(req: Request) {
  const token = req.headers.get('cookie')?.match(/admin_token=([^;]+)/)?.[1];
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.ADMIN_JWT_SECRET));
    return true;
  } catch { return false; }
}

export async function GET(req: Request) {
  if (!await checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '7d';

  const now = new Date();
  const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Get all sessions and events in range
  const [sessions, events] = await Promise.all([
    prisma.session.findMany({
      where: { startedAt: { gte: startDate } },
      select: { startedAt: true, duration: true, device: true, visitorId: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { timestamp: { gte: startDate } },
      select: { timestamp: true, eventType: true, eventName: true },
    }),
  ]);

  // Group by date
  const dateMap: Record<string, {
    date: string;
    visitors: Set<string>;
    sessions: number;
    pageViews: number;
    conversions: number;
    filterUses: number;
    totalDuration: number;
    sessionCount: number;
  }> = {};

  // Initialize all dates in range
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split('T')[0];
    dateMap[key] = {
      date: key,
      visitors: new Set(),
      sessions: 0,
      pageViews: 0,
      conversions: 0,
      filterUses: 0,
      totalDuration: 0,
      sessionCount: 0,
    };
  }

  // Aggregate sessions
  sessions.forEach((s) => {
    const key = s.startedAt.toISOString().split('T')[0];
    if (dateMap[key]) {
      dateMap[key].visitors.add(s.visitorId);
      dateMap[key].sessions++;
      if (s.duration) {
        dateMap[key].totalDuration += s.duration;
        dateMap[key].sessionCount++;
      }
    }
  });

  // Aggregate events
  events.forEach((e) => {
    const key = e.timestamp.toISOString().split('T')[0];
    if (dateMap[key]) {
      if (e.eventType === 'page_view') dateMap[key].pageViews++;
      else if (e.eventType === 'conversion') dateMap[key].conversions++;
      else if (e.eventType === 'filter_use') dateMap[key].filterUses++;
    }
  });

  // Convert to array
  const daily = Object.values(dateMap).map((d) => ({
    date: d.date,
    visitors: d.visitors.size,
    sessions: d.sessions,
    pageViews: d.pageViews,
    conversions: d.conversions,
    filterUses: d.filterUses,
    avgDuration: d.sessionCount > 0 ? Math.round(d.totalDuration / d.sessionCount) : 0,
  }));

  // Weekly aggregation
  const weekly: typeof daily = [];
  for (let i = 0; i < daily.length; i += 7) {
    const week = daily.slice(i, i + 7);
    if (week.length === 0) continue;
    weekly.push({
      date: week[0].date,
      visitors: week.reduce((sum, d) => sum + d.visitors, 0),
      sessions: week.reduce((sum, d) => sum + d.sessions, 0),
      pageViews: week.reduce((sum, d) => sum + d.pageViews, 0),
      conversions: week.reduce((sum, d) => sum + d.conversions, 0),
      filterUses: week.reduce((sum, d) => sum + d.filterUses, 0),
      avgDuration: Math.round(week.reduce((sum, d) => sum + d.avgDuration, 0) / week.length),
    });
  }

  // Hourly distribution (all time in range)
  const hourly = Array.from({ length: 24 }, (_, i) => ({ hour: i, sessions: 0, pageViews: 0 }));
  sessions.forEach((s) => {
    const hour = s.startedAt.getHours();
    hourly[hour].sessions++;
  });
  events.filter((e) => e.eventType === 'page_view').forEach((e) => {
    const hour = e.timestamp.getHours();
    hourly[hour].pageViews++;
  });

  // Device breakdown
  const devices: Record<string, number> = {};
  sessions.forEach((s) => {
    const device = s.device || 'unknown';
    devices[device] = (devices[device] || 0) + 1;
  });

  // Event type breakdown
  const eventTypes: Record<string, number> = {};
  events.forEach((e) => {
    eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
  });

  return NextResponse.json({
    daily,
    weekly,
    hourly,
    devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
    eventTypes: Object.entries(eventTypes).map(([name, value]) => ({ name, value })),
  });
}
