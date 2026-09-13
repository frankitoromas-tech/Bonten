// =========================================
//  API DE CIERRE DE SESIÓN — BONTEN DEFENSE
//  Revocación inmediata de cookie de sesión.
// =========================================

import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/security/auth';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Sesión terminada con éxito' });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}
