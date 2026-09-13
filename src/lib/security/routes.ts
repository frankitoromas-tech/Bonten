// =======================================================================
//  REGISTRO FORMAL DE RUTAS & CONTROL RBAC — BONTEN DEFENSE
//  Clasificación estricta de rutas públicas y protegidas.
// =======================================================================

export const PUBLIC_ROUTES = [
  '/',
  '/integrantes',
  '/manifiestos',
  '/debates',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/admin/login',
];

export const MEMBER_PROTECTED_ROUTES = [
  '/perfil',
  '/api/debates/argument',
];

export const ADMIN_PROTECTED_ROUTES = [
  '/admin',
  '/api/admin',
];

/** Determina si una ruta es pública sin requerir sesión previa */
export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith('/integrantes/')) return true;
  if (pathname.startsWith('/manifiestos/')) return true;
  if (pathname.startsWith('/api/auth/')) return true;
  if (pathname.startsWith('/api/admin/login')) return true;
  return false;
}

/** Determina si una ruta requiere privilegios de Administrador */
export function isAdminRoute(pathname: string): boolean {
  if (pathname.startsWith('/admin/login')) return false;
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

/** Determina si una ruta requiere al menos una cuenta de miembro verificada */
export function isMemberRoute(pathname: string): boolean {
  return MEMBER_PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));
}
