import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.match(/admin_token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ authenticated: false });

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
