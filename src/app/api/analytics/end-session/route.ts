import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { sessionId, duration } = await req.json();
  
  if (sessionId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { endedAt: new Date(), duration },
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
