import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { shoes, brands, categories } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, createAuthError } from '../../../lib/auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id!);

    const [result] = await db
      .select({
        shoe: shoes,
        brand: brands,
        category: categories,
      })
      .from(shoes)
      .leftJoin(brands, eq(shoes.brand_id, brands.id))
      .leftJoin(categories, eq(shoes.category_id, categories.id))
      .where(eq(shoes.id, id))
      .limit(1);

    if (!result) {
      return createAuthError(404, 'Shoe not found');
    }

    const formattedShoe = {
      ...result.shoe,
      brand: result.brand,
      category: result.category,
      sizes: JSON.parse(result.shoe.sizes),
      images: result.shoe.images ? JSON.parse(result.shoe.images) : [],
      features: result.shoe.features ? JSON.parse(result.shoe.features) : [],
    };

    return new Response(JSON.stringify({ shoe: formattedShoe }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get shoe error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    await requireAdmin(cookies);

    const id = parseInt(params.id!);
    const body = await request.json();

    const updateData: any = { ...body };
    
    if (body.sizes) {
      updateData.sizes = JSON.stringify(body.sizes);
    }
    if (body.images) {
      updateData.images = JSON.stringify(body.images);
    }
    if (body.features) {
      updateData.features = JSON.stringify(body.features);
    }
    if (body.is_featured !== undefined) {
      updateData.is_featured = body.is_featured ? 1 : 0;
    }
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active ? 1 : 0;
    }

    updateData.updated_at = new Date();

    const [shoe] = await db
      .update(shoes)
      .set(updateData)
      .where(eq(shoes.id, id))
      .returning();

    if (!shoe) {
      return createAuthError(404, 'Shoe not found');
    }

    return new Response(JSON.stringify({ shoe }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createAuthError(401, 'Unauthorized');
    }
    if (error.message === 'Forbidden') {
      return createAuthError(403, 'Forbidden');
    }
    console.error('Update shoe error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    await requireAdmin(cookies);

    const id = parseInt(params.id!);

    // Soft delete
    const [shoe] = await db
      .update(shoes)
      .set({ is_active: 0 })
      .where(eq(shoes.id, id))
      .returning();

    if (!shoe) {
      return createAuthError(404, 'Shoe not found');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Shoe deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createAuthError(401, 'Unauthorized');
    }
    if (error.message === 'Forbidden') {
      return createAuthError(403, 'Forbidden');
    }
    console.error('Delete shoe error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
