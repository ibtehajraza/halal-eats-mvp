import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Track events from client
export async function POST(req: Request) {
  const { visitorId, sessionId, eventType, eventName, page, restaurantId, metadata } = await req.json();

  if (!visitorId || !sessionId) {
    return NextResponse.json({ error: 'Missing visitor or session' }, { status: 400 });
  }

  // Upsert visitor
  await prisma.visitor.upsert({
    where: { fingerprint: visitorId },
    update: { lastSeen: new Date(), totalPageViews: { increment: eventType === 'page_view' ? 1 : 0 } },
    create: { fingerprint: visitorId, totalSessions: 1, totalPageViews: eventType === 'page_view' ? 1 : 0 },
  });

  const visitor = await prisma.visitor.findUnique({ where: { fingerprint: visitorId } });
  if (!visitor) return NextResponse.json({ error: 'Visitor not found' }, { status: 400 });

  // Upsert session
  const userAgent = req.headers.get('user-agent') || '';
  const device = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';

  let session = await prisma.session.findFirst({
    where: { id: sessionId, visitorId: visitor.id },
  });

  if (!session) {
    session = await prisma.session.create({
      data: {
        id: sessionId,
        visitorId: visitor.id,
        userAgent,
        device,
        referrer: metadata?.referrer,
        landingPage: page,
      },
    });
    await prisma.visitor.update({ where: { id: visitor.id }, data: { totalSessions: { increment: 1 } } });
  }

  // Update session
  await prisma.session.update({
    where: { id: session.id },
    data: {
      pageViews: eventType === 'page_view' ? { increment: 1 } : undefined,
      exitPage: page,
    },
  });

  // Create event
  await prisma.analyticsEvent.create({
    data: {
      visitorId: visitor.id,
      sessionId: session.id,
      eventType,
      eventName,
      page,
      restaurantId: restaurantId || null,
      metadata: metadata || {},
    },
  });

  // Update restaurant stats for conversions
  if (restaurantId && ['directions_click', 'call_click', 'website_click'].includes(eventName)) {
    const field = eventName === 'directions_click' ? 'totalDirections' 
      : eventName === 'call_click' ? 'totalCalls' : 'totalWebsiteClicks';
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { [field]: { increment: 1 } },
    }).catch(() => {}); // Ignore if restaurant doesn't exist
  }

  if (restaurantId && eventType === 'page_view') {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { totalViews: { increment: 1 } },
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
