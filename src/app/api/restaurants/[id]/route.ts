import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single restaurant
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: {
      cuisines: { include: { cuisine: true } },
      features: { include: { feature: true } },
      hours: true,
    },
  });

  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...restaurant,
    cuisines: restaurant.cuisines.map((c) => c.cuisine.name),
    features: restaurant.features.map((f) => f.feature.name),
    hours: Object.fromEntries(restaurant.hours.map((h) => [h.days, h.hours])),
  });
}

// PUT update restaurant
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();

  // Delete existing relations
  await prisma.restaurantCuisine.deleteMany({ where: { restaurantId: params.id } });
  await prisma.restaurantFeature.deleteMany({ where: { restaurantId: params.id } });
  await prisma.restaurantHours.deleteMany({ where: { restaurantId: params.id } });

  const cuisineRecords = await prisma.cuisine.findMany({ where: { name: { in: data.cuisines || [] } } });
  const featureRecords = await prisma.feature.findMany({ where: { name: { in: data.features || [] } } });

  const restaurant = await prisma.restaurant.update({
    where: { id: params.id },
    data: {
      name: data.name,
      slug: data.slug,
      address: data.address,
      phone: data.phone,
      website: data.website,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      halalStatus: data.halalStatus,
      halalNote: data.halalNote,
      priceRange: parseInt(data.priceRange),
      rating: data.rating ? parseFloat(data.rating) : null,
      photos: data.photos || [],
      cuisines: { create: cuisineRecords.map((c) => ({ cuisineId: c.id })) },
      features: { create: featureRecords.map((f) => ({ featureId: f.id })) },
      hours: { create: data.hours || [] },
    },
  });

  return NextResponse.json(restaurant);
}

// DELETE restaurant
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.restaurant.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
