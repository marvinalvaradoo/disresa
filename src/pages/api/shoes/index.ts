import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { shoes, brands, categories } from '../../../db/schema';
import { eq, and, like, desc, sql } from 'drizzle-orm';
import { requireAdmin, createAuthError } from '../../../lib/auth';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    let query = db
      .select({
        shoe: shoes,
        brand: brands,
        category: categories,
      })
      .from(shoes)
      .leftJoin(brands, eq(shoes.brand_id, brands.id))
      .leftJoin(categories, eq(shoes.category_id, categories.id))
      .where(eq(shoes.is_active, 1));

    // Apply filters
    const conditions = [eq(shoes.is_active, 1)];

    if (category) {
      conditions.push(eq(categories.slug, category));
    }

    if (brand) {
      conditions.push(eq(brands.slug, brand));
    }

    if (search) {
      conditions.push(
        sql`${shoes.name} LIKE ${`%${search}%`} OR ${shoes.description} LIKE ${`%${search}%`}`
      );
    }

    if (featured === 'true') {
      conditions.push(eq(shoes.is_featured, 1));
    }

    const results = await db
      .select({
        shoe: shoes,
        brand: brands,
        category: categories,
      })
      .from(shoes)
      .leftJoin(brands, eq(shoes.brand_id, brands.id))
      .leftJoin(categories, eq(shoes.category_id, categories.id))
      .where(and(...conditions))
      .orderBy(desc(shoes.created_at))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(shoes)
      .leftJoin(brands, eq(shoes.brand_id, brands.id))
      .leftJoin(categories, eq(shoes.category_id, categories.id))
      .where(and(...conditions));

    const formattedResults = results.map(({ shoe, brand, category }) => ({
      ...shoe,
      brand: brand,
      category: category,
      sizes: JSON.parse(shoe.sizes),
      images: shoe.images ? JSON.parse(shoe.images) : [],
      features: shoe.features ? JSON.parse(shoe.features) : [],
    }));

    return new Response(
      JSON.stringify({
        shoes: formattedResults,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get shoes error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    await requireAdmin(cookies);

    const body = await request.json();
    const {
      name,
      slug,
      brand_id,
      category_id,
      price,
      original_price,
      stock,
      sizes,
      image_url,
      images,
      description,
      features,
      is_featured,
      is_active,
    } = body;

    if (!name || !brand_id || !category_id || !price || !sizes) {
      return createAuthError(400, 'Missing required fields');
    }

    const [shoe] = await db
      .insert(shoes)
      .values({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        brand_id,
        category_id,
        price,
        original_price,
        stock: stock || 0,
        sizes: JSON.stringify(sizes),
        image_url,
        images: images ? JSON.stringify(images) : null,
        description,
        features: features ? JSON.stringify(features) : null,
        is_featured: is_featured ? 1 : 0,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      })
      .returning();

    return new Response(JSON.stringify({ shoe }), {
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
    console.error('Create shoe error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    await requireAdmin(cookies);

    const body = await request.json();
    const {
      id,
      name,
      slug,
      brand_id,
      category_id,
      price,
      original_price,
      stock,
      sizes,
      image_url,
      images,
      description,
      features,
      is_featured,
      is_active,
    } = body;

    if (!id) {
      return createAuthError(400, 'Product ID is required');
    }

    const [updatedShoe] = await db
      .update(shoes)
      .set({
        name,
        slug,
        brand_id,
        category_id,
        price,
        original_price,
        stock,
        sizes: JSON.stringify(sizes),
        image_url,
        images: images ? JSON.stringify(images) : null,
        description,
        features: features ? JSON.stringify(features) : null,
        is_featured: is_featured ? 1 : 0,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
        updated_at: new Date(),
      })
      .where(eq(shoes.id, id))
      .returning();

    if (!updatedShoe) {
      return createAuthError(404, 'Product not found');
    }

    return new Response(JSON.stringify({ shoe: updatedShoe }), {
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
