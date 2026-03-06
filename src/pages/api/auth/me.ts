import type { APIRoute } from 'astro';
import { getSession, createAuthError } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getSession(cookies);

  if (!user) {
    return createAuthError(401, 'Not authenticated');
  }

  return new Response(
    JSON.stringify({ user }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
