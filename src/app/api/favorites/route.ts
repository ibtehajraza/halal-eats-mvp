import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET favorites for a visitor
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const visitorId = searchParams.get('visitorId');
  
  if (!visitorId) return NextResponse.json([]);

  const favorites = await prisma.favorite.findMany({
    where: { visitorId },
    select: { restaurantId: true },
  });

  return NextResponse.json(favorites.map((f) => f.restaurantId));
}

// POST toggle favorite
export async function POST(req: Request) {
  const { visitorId, restaurantId } = await req.json();
  
  if (!visitorId || !restaurantId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { visitorId_restaurantId: { visitorId, restaurantId } },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { visitorId_restaurantId: { visitorId, restaurantId } },
    });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favorite.create({
      data: { visitorId, restaurantId },
    });
    return NextResponse.json({ favorited: true });
  }
}
