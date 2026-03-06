import type { APIRoute } from 'astro';
import { db } from '../../../db';
import { invoices } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '../../../lib/auth';

// GET all invoices
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const user = await getSession(cookies);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allInvoices = await db.select().from(invoices);

    return new Response(JSON.stringify(allInvoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST create new invoice
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const user = await getSession(cookies);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    const newInvoice = await db.insert(invoices).values({
      invoice_number: data.invoice_number,
      customer_id: data.customer_id || null,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      subtotal: data.subtotal,
      tax: data.tax || 0,
      discount: data.discount || 0,
      total: data.total,
      status: data.status || 'pending',
      notes: data.notes || null,
      created_by: user.id,
    }).returning();

    return new Response(JSON.stringify(newInvoice[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PUT update invoice
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const user = await getSession(cookies);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    if (!data.id) {
      return new Response(JSON.stringify({ error: 'Invoice ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedInvoice = await db
      .update(invoices)
      .set({
        invoice_number: data.invoice_number,
        customer_id: data.customer_id || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        status: data.status,
        notes: data.notes || null,
      })
      .where(eq(invoices.id, data.id))
      .returning();

    return new Response(JSON.stringify(updatedInvoice[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
