import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { brands } from '../../../db/schema';
import { requireAdmin, createAuthError } from '../../../lib/auth';

export const GET: APIRoute = async () => {
  try {
    const allBrands = await db.select().from(brands);

    return new Response(JSON.stringify({ brands: allBrands }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get brands error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    await requireAdmin(cookies);

    const body = await request.json();
    const { name, slug, logo_url } = body;

    if (!name || !slug) {
      return createAuthError(400, 'Name and slug are required');
    }

    const [brand] = await db
      .insert(brands)
      .values({ name, slug, logo_url })
      .returning();

    return new Response(JSON.stringify({ brand }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createAuthError(401, 'Unauthorized');
    }
    if (error.message === 'Forbidden') {
      return createAuthError(403, 'Forbidden');
    }
    console.error('Create brand error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
