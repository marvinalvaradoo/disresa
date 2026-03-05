import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  hashed_password: text('hashed_password').notNull(),
  role: text('role', { enum: ['admin', 'staff'] }).notNull().default('staff'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const shoes = sqliteTable('shoes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  category_id: integer('category_id').notNull().references(() => categories.id),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  sizes: text('sizes').notNull(), // JSON array
  image_url: text('image_url'),
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  categoryIdx: index('shoes_category_idx').on(table.category_id),
}));

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoice_number: text('invoice_number').notNull().unique(),
  customer_name: text('customer_name').notNull(),
  customer_email: text('customer_email').notNull(),
  total: real('total').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'cancelled'] }).notNull().default('pending'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  created_by: text('created_by').notNull().references(() => users.id),
}, (table) => ({
  statusIdx: index('invoices_status_idx').on(table.status),
  createdByIdx: index('invoices_created_by_idx').on(table.created_by),
}));

export const invoice_items = sqliteTable('invoice_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoice_id: integer('invoice_id').notNull().references(() => invoices.id),
  shoe_id: integer('shoe_id').notNull().references(() => shoes.id),
  quantity: integer('quantity').notNull(),
  unit_price: real('unit_price').notNull(),
  subtotal: real('subtotal').notNull(),
}, (table) => ({
  invoiceIdx: index('invoice_items_invoice_idx').on(table.invoice_id),
  shoeIdx: index('invoice_items_shoe_idx').on(table.shoe_id),
}));
