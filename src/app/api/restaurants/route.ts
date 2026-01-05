import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all restaurants with optional search
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const filter = searchParams.get('filter'); // trending, new

  let restaurants = await prisma.restaurant.findMany({
    include: {
      cuisines: { include: { cuisine: true } },
      features: { include: { feature: true } },
      hours: true,
    },
    orderBy: filter === 'trending' ? { totalViews: 'desc' } : filter === 'new' ? { createdAt: 'desc' } : { name: 'asc' },
  });

  // Filter for "new this week"
  if (filter === 'new') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    restaurants = restaurants.filter((r) => r.createdAt >= weekAgo);
  }

  // Search filter
  if (search) {
    restaurants = restaurants.filter((r) => 
      r.name.toLowerCase().includes(search) ||
      r.cuisines.some((c) => c.cuisine.name.toLowerCase().includes(search)) ||
      r.address.toLowerCase().includes(search) ||
      (r.halalNote?.toLowerCase().includes(search))
    );
  }

  const formatted = restaurants.map((r) => ({
    ...r,
    cuisines: r.cuisines.map((c) => c.cuisine.name),
    features: r.features.map((f) => f.feature.name),
    hours: Object.fromEntries(r.hours.map((h) => [h.days, h.hours])),
  }));

  return NextResponse.json(formatted);
}

// POST create restaurant
export async function POST(req: Request) {
  const data = await req.json();
  
  const cuisineRecords = await prisma.cuisine.findMany({ where: { name: { in: data.cuisines || [] } } });
  const featureRecords = await prisma.feature.findMany({ where: { name: { in: data.features || [] } } });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      address: data.address,
      phone: data.phone,
      website: data.website,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      halalStatus: data.halalStatus || 'self-reported',
      halalNote: data.halalNote,
      priceRange: parseInt(data.priceRange) || 2,
      rating: data.rating ? parseFloat(data.rating) : null,
      photos: data.photos || [],
      cuisines: { create: cuisineRecords.map((c) => ({ cuisineId: c.id })) },
      features: { create: featureRecords.map((f) => ({ featureId: f.id })) },
      hours: { create: data.hours || [] },
    },
    include: {
      cuisines: { include: { cuisine: true } },
      features: { include: { feature: true } },
      hours: true,
    },
  });

  return NextResponse.json(restaurant, { status: 201 });
}
