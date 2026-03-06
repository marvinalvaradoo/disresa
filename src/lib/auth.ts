import { SignJWT, jwtVerify } from 'jose';
import { serialize, parse } from 'cookie';
import type { AstroCookies } from 'astro';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'disresa-secret-key-change-in-production-2024'
);

const COOKIE_NAME = 'disresa_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'staff';
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function getSession(cookies: AstroCookies): Promise<SessionUser | null> {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  
  return verifySession(token);
}

export async function setSessionCookie(cookies: AstroCookies, user: SessionUser): Promise<void> {
  const token = await createSession(user);
  cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export async function requireAuth(cookies: AstroCookies): Promise<SessionUser> {
  const user = await getSession(cookies);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(cookies: AstroCookies): Promise<SessionUser> {
  const user = await requireAuth(cookies);
  if (user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}

// Helper for API routes
export function createAuthError(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
