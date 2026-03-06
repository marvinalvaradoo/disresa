import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { carts, cart_items, shoes } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { createAuthError } from '../../../lib/auth';

// Add item to cart
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cartId, shoe_id, size, quantity = 1 } = body;

    if (!cartId || !shoe_id || !size) {
      return createAuthError(400, 'Cart ID, shoe ID, and size are required');
    }

    // Verify cart exists
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.id, cartId))
      .limit(1);

    if (!cart) {
      return createAuthError(404, 'Cart not found');
    }

    // Verify shoe exists and has stock
    const [shoe] = await db
      .select()
      .from(shoes)
      .where(eq(shoes.id, shoe_id))
      .limit(1);

    if (!shoe) {
      return createAuthError(404, 'Product not found');
    }

    if (shoe.stock < quantity) {
      return createAuthError(400, 'Insufficient stock');
    }

    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cartId),
          eq(cart_items.shoe_id, shoe_id),
          eq(cart_items.size, size)
        )
      )
      .limit(1);

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (shoe.stock < newQuantity) {
        return createAuthError(400, 'Insufficient stock');
      }

      const [updatedItem] = await db
        .update(cart_items)
        .set({
          quantity: newQuantity,
          updated_at: new Date(),
        })
        .where(eq(cart_items.id, existingItem.id))
        .returning();

      return new Response(
        JSON.stringify({ item: updatedItem, message: 'Quantity updated' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Add new item
    const [item] = await db
      .insert(cart_items)
      .values({
        cart_id: cartId,
        shoe_id,
        size,
        quantity,
      })
      .returning();

    // Update cart updated_at
    await db
      .update(carts)
      .set({ updated_at: new Date() })
      .where(eq(carts.id, cartId));

    return new Response(
      JSON.stringify({ item, message: 'Item added to cart' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

// Update item quantity
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return createAuthError(400, 'Item ID and quantity are required');
    }

    if (quantity < 1) {
      return createAuthError(400, 'Quantity must be at least 1');
    }

    // Get item
    const [item] = await db
      .select()
      .from(cart_items)
      .where(eq(cart_items.id, itemId))
      .limit(1);

    if (!item) {
      return createAuthError(404, 'Item not found');
    }

    // Check stock
    const [shoe] = await db
      .select()
      .from(shoes)
      .where(eq(shoes.id, item.shoe_id))
      .limit(1);

    if (!shoe) {
      return createAuthError(404, 'Product not found');
    }

    if (shoe.stock < quantity) {
      return createAuthError(400, 'Insufficient stock');
    }

    // Update quantity
    const [updatedItem] = await db
      .update(cart_items)
      .set({
        quantity,
        updated_at: new Date(),
      })
      .where(eq(cart_items.id, itemId))
      .returning();

    return new Response(
      JSON.stringify({ item: updatedItem, message: 'Quantity updated' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Update cart item error:', error);
    return createAuthError(500, 'Internal server error');
  }
};

// Remove item from cart
export const DELETE: APIRoute = async ({ url }) => {
  try {
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return createAuthError(400, 'Item ID is required');
    }

    await db.delete(cart_items).where(eq(cart_items.id, parseInt(itemId)));

    return new Response(
      JSON.stringify({ success: true, message: 'Item removed from cart' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Remove cart item error:', error);
    return createAuthError(500, 'Internal server error');
  }
};
