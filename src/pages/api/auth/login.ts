import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { setSessionCookie, createAuthError } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return createAuthError(400, 'Email and password are required');
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return createAuthError(401, 'Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.hashed_password);
    if (!isValid) {
      return createAuthError(401, 'Invalid credentials');
    }

    // Create session
    await setSessionCookie(cookies, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
