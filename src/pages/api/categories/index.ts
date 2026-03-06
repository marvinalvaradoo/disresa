import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { categories } from '../../../db/schema';
import { requireAdmin, createAuthError } from '../../../lib/auth';

export const GET: APIRoute = async () => {
  try {
    const allCategories = await db.select().from(categories);

    return new Response(JSON.stringify({ categories: allCategories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    await requireAdmin(cookies);

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return createAuthError(400, 'Name and slug are required');
    }

    const [category] = await db
      .insert(categories)
      .values({ name, slug, description })
      .returning();

    return new Response(JSON.stringify({ category }), {
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
    console.error('Create category error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
