import { NextResponse } from 'next/server';
import { restaurants, searchRestaurants } from '@/lib/static-data';

// GET all restaurants with optional search (static data - no DB)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const filter = searchParams.get('filter');

  let result = [...restaurants];

  // Sort by filter
  if (filter === 'trending') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (filter === 'new') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Search filter
  if (search) {
    result = searchRestaurants(search);
  }

  return NextResponse.json(result);
}

// POST - disabled for static POC
export async function POST() {
  return NextResponse.json({ error: 'Read-only POC mode' }, { status: 403 });
}
