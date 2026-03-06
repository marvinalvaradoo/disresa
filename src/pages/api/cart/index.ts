import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { carts, cart_items, shoes, brands } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { createAuthError } from '../../../lib/auth';

// Get cart by ID
export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const cartId = url.searchParams.get('cartId');
    
    if (!cartId) {
      return createAuthError(400, 'Cart ID is required');
    }

    // Get cart
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);

    if (!cart) {
      return new Response(
        JSON.stringify({ cart: null, items: [], total: 0, itemCount: 0 }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get cart items with product details
    const items = await db
      .select({
        item: cart_items,
        shoe: shoes,
        brand: brands,
      })
      .from(cart_items)
      .leftJoin(shoes, eq(cart_items.shoe_id, shoes.id))
      .leftJoin(brands, eq(shoes.brand_id, brands.id))
      .where(eq(cart_items.cart_id, cartId));

    const formattedItems = items.map(({ item, shoe, brand }) => ({
      id: item.id,
      shoe_id: item.shoe_id,
      name: shoe?.name || '',
      brand: brand?.name || '',
      image_url: shoe?.image_url || '',
      price: shoe?.price || 0,
      size: item.size,
      quantity: item.quantity,
      subtotal: (shoe?.price || 0) * item.quantity,
    }));

    const total = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = formattedItems.reduce((sum, item) => sum + item.quantity, 0);

    return new Response(
      JSON.stringify({
        cart,
        items: formattedItems,
        total,
        itemCount,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get cart error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

// Create new cart
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cartId, customer_email } = body;

    if (!cartId) {
      return createAuthError(400, 'Cart ID is required');
    }

    // Check if cart already exists
    const [existingCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);

    if (existingCart) {
      return new Response(
        JSON.stringify({ cart: existingCart }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new cart (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [cart] = await db
      .insert(carts)
      .values({
        id: cartId,
        customer_email: customer_email || null,
        expires_at: expiresAt,
      })
      .returning();

    return new Response(
      JSON.stringify({ cart }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Create cart error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

// Clear cart
export const DELETE: APIRoute = async ({ url }) => {
  try {
    const cartId = url.searchParams.get('cartId');

    if (!cartId) {
      return createAuthError(400, 'Cart ID is required');
    }

    // Delete cart (cascade will delete items)
    await db.delete(carts).where(eq(carts.id, cartId));

    return new Response(
      JSON.stringify({ success: true, message: 'Cart cleared' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Clear cart error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
