import { NextResponse } from 'next/server';
import { USER_SESSION_COOKIE } from '@/lib/security/memberAuth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: USER_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
