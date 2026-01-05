import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60,
  });

  return response;
}
