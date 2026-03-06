import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  clearSessionCookie(cookies);

  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
