// =======================================================================
//  REPOSITORIO DE BASE DE DATOS TRANSACCIONAL — BONTEN CORE
//  Gestiona usuarios, recuperación de claves (OWASP) y argumentos de debate.
// =======================================================================

import crypto from 'node:crypto';
import { hashPassword } from '../security/auth.ts';
import { sanitizePlainText, sanitizeHtml } from '../security/sanitizer.ts';

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: 'ROLE_MEMBER' | 'ROLE_ADMIN' | 'ROLE_SUPERADMIN';
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface PasswordResetToken {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: number;
  usedAt: number | null;
  ipAddress: string;
  createdAt: string;
}

export interface StoredDebateArgument {
  id: number;
  debateId: number;
  userId: number;
  username: string;
  userRole: string;
  avatarUrl: string;
  stance: 'pro' | 'contra';
  text: string;
  createdAt: string;
}

// Almacén en memoria persistente para el runtime
const users: User[] = [];
const resetTokens: PasswordResetToken[] = [];
const debateArguments: StoredDebateArgument[] = [];
let nextUserId = 1;
let nextResetId = 1;
let nextArgId = 100; // Inicia después de los argumentos estáticos iniciales

// Semilla inicial: Fireboy como SUPERADMIN
const adminPass = hashPassword('fireboy_bonten_2026');
users.push({
  id: nextUserId++,
  username: 'fireboy',
  email: 'fireboy@bonten.org',
  passwordHash: adminPass.hash,
  passwordSalt: adminPass.salt,
  role: 'ROLE_SUPERADMIN',
  avatarUrl: '/assets/fireboy_client.webp',
  isActive: true,
  createdAt: new Date().toISOString(),
});

// Semilla inicial: Miembro de prueba de la comunidad
const memberPass = hashPassword('bonten_member_123');
users.push({
  id: nextUserId++,
  username: 'estudiante_filo',
  email: 'estudiante@bonten.org',
  passwordHash: memberPass.hash,
  passwordSalt: memberPass.salt,
  role: 'ROLE_MEMBER',
  avatarUrl: '/assets/daniel_client.webp',
  isActive: true,
  createdAt: new Date().toISOString(),
});

/** Buscar usuario por email (normalizado en minúsculas) */
export function findUserByEmail(email: string): User | null {
  const norm = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === norm && u.isActive) || null;
}

/** Buscar usuario por nombre de usuario */
export function findUserByUsername(username: string): User | null {
  const norm = username.trim().toLowerCase();
  return users.find((u) => u.username.toLowerCase() === norm && u.isActive) || null;
}

/** Buscar usuario por ID */
export function findUserById(id: number): User | null {
  return users.find((u) => u.id === id && u.isActive) || null;
}

/** Registrar nuevo usuario miembro */
export function createUser(params: {
  username: string;
  email: string;
  password: string;
  role?: User['role'];
}): { user?: User; error?: string } {
  const cleanUsername = sanitizePlainText(params.username, 30);
  const cleanEmail = params.email.trim().toLowerCase();

  if (cleanUsername.length < 3) {
    return { error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { error: 'El correo electrónico no es válido' };
  }
  if (params.password.length < 8) {
    return { error: 'La contraseña debe tener un mínimo de 8 caracteres' };
  }

  if (findUserByUsername(cleanUsername)) {
    return { error: 'El nombre de usuario ya está registrado' };
  }
  if (findUserByEmail(cleanEmail)) {
    return { error: 'El correo electrónico ya está registrado' };
  }

  const { hash, salt } = hashPassword(params.password);
  const newUser: User = {
    id: nextUserId++,
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hash,
    passwordSalt: salt,
    role: params.role || 'ROLE_MEMBER',
    avatarUrl: '/assets/daniel_client.webp',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return { user: newUser };
}

/** Actualizar contraseña de usuario */
export function updateUserPassword(userId: number, newPassword: string): boolean {
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  return true;
}

/** Crear token criptográfico de reseteo con hash SHA-256 (OWASP Anti-Leak) */
export function createPasswordResetToken(
  userId: number,
  ipAddress: string,
  ttlMs = 15 * 60 * 1000 // 15 minutos
): { plainToken: string; expiresAt: number } {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
  const expiresAt = Date.now() + ttlMs;

  resetTokens.push({
    id: nextResetId++,
    userId,
    tokenHash,
    expiresAt,
    usedAt: null,
    ipAddress,
    createdAt: new Date().toISOString(),
  });

  return { plainToken, expiresAt };
}

/** Verificar y consumir token de reseteo (un solo uso) */
export function verifyAndConsumeResetToken(plainToken: string): {
  valid: boolean;
  userId?: number;
  error?: string;
} {
  if (!plainToken || plainToken.length < 32) {
    return { valid: false, error: 'Token con longitud inválida' };
  }

  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
  const record = resetTokens.find((r) => r.tokenHash === tokenHash);

  if (!record) {
    return { valid: false, error: 'Token de restablecimiento inexistente o inválido' };
  }

  if (record.usedAt !== null) {
    return { valid: false, error: 'Este token ya ha sido utilizado previamente' };
  }

  if (Date.now() > record.expiresAt) {
    return { valid: false, error: 'El token de restablecimiento ha expirado (límite 15 min)' };
  }

  // Consumir el token inmediatamente (inhabilitar segundo uso)
  record.usedAt = Date.now();

  return { valid: true, userId: record.userId };
}

/** Guardar nuevo argumento de debate */
export function addDebateArgument(arg: {
  debateId: number;
  userId: number;
  username: string;
  userRole: string;
  avatarUrl: string;
  stance: 'pro' | 'contra';
  text: string;
}): StoredDebateArgument {
  const newArg: StoredDebateArgument = {
    id: nextArgId++,
    debateId: arg.debateId,
    userId: arg.userId,
    username: sanitizePlainText(arg.username, 40),
    userRole: sanitizePlainText(arg.userRole, 30),
    avatarUrl: arg.avatarUrl,
    stance: arg.stance,
    text: sanitizeHtml(arg.text),
    createdAt: new Date().toISOString(),
  };

  debateArguments.push(newArg);
  return newArg;
}

/** Consultar argumentos dinámicos por debate */
export function getDebateArguments(debateId: number): StoredDebateArgument[] {
  return debateArguments.filter((a) => a.debateId === debateId);
}
