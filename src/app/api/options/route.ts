import { NextResponse } from 'next/server';
import { cuisines, features } from '@/lib/static-data';

export async function GET() {
  return NextResponse.json({ cuisines, features });
}
