import { NextResponse } from 'next/server';
import { getRestaurantById } from '@/lib/static-data';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const restaurant = getRestaurantById(params.id);
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(restaurant);
}
