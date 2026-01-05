import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [cuisines, features] = await Promise.all([
    prisma.cuisine.findMany({ orderBy: { name: 'asc' } }),
    prisma.feature.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return NextResponse.json({ cuisines: cuisines.map((c) => c.name), features: features.map((f) => f.name) });
}
