import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  hashed_password: text('hashed_password').notNull(),
  role: text('role', { enum: ['admin', 'staff'] }).notNull().default('staff'),
  name: text('name'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Categories table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: index('categories_slug_idx').on(table.slug),
}));

// Brands table
export const brands = sqliteTable('brands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo_url: text('logo_url'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: index('brands_slug_idx').on(table.slug),
}));

// Shoes (products) table
export const shoes = sqliteTable('shoes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  brand_id: integer('brand_id').notNull().references(() => brands.id),
  category_id: integer('category_id').notNull().references(() => categories.id),
  price: real('price').notNull(),
  original_price: real('original_price'),
  stock: integer('stock').notNull().default(0),
  sizes: text('sizes').notNull(), // JSON array
  image_url: text('image_url'),
  images: text('images'), // JSON array
  description: text('description'),
  features: text('features'), // JSON array
  is_featured: integer('is_featured').notNull().default(0),
  is_active: integer('is_active').notNull().default(1),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  categoryIdx: index('shoes_category_idx').on(table.category_id),
  brandIdx: index('shoes_brand_idx').on(table.brand_id),
  featuredIdx: index('shoes_featured_idx').on(table.is_featured),
  activeIdx: index('shoes_active_idx').on(table.is_active),
  slugIdx: index('shoes_slug_idx').on(table.slug),
}));

// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Invoices table
export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoice_number: text('invoice_number').notNull().unique(),
  customer_id: integer('customer_id').references(() => customers.id),
  customer_name: text('customer_name').notNull(),
  customer_email: text('customer_email').notNull(),
  subtotal: real('subtotal').notNull(),
  tax: real('tax').notNull().default(0),
  discount: real('discount').notNull().default(0),
  total: real('total').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'cancelled', 'refunded'] }).notNull().default('pending'),
  notes: text('notes'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  created_by: text('created_by').notNull().references(() => users.id),
}, (table) => ({
  statusIdx: index('invoices_status_idx').on(table.status),
  customerIdx: index('invoices_customer_idx').on(table.customer_id),
  createdByIdx: index('invoices_created_by_idx').on(table.created_by),
}));

// Invoice items table
export const invoice_items = sqliteTable('invoice_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoice_id: integer('invoice_id').notNull().references(() => invoices.id),
  shoe_id: integer('shoe_id').notNull().references(() => shoes.id),
  shoe_name: text('shoe_name').notNull(),
  size: text('size'),
  quantity: integer('quantity').notNull(),
  unit_price: real('unit_price').notNull(),
  subtotal: real('subtotal').notNull(),
}, (table) => ({
  invoiceIdx: index('invoice_items_invoice_idx').on(table.invoice_id),
  shoeIdx: index('invoice_items_shoe_idx').on(table.shoe_id),
}));

// Cart table (session-based carts)
export const carts = sqliteTable('carts', {
  id: text('id').primaryKey(), // UUID or session ID
  customer_email: text('customer_email'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  expires_at: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Cart items table
export const cart_items = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cart_id: text('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  shoe_id: integer('shoe_id').notNull().references(() => shoes.id),
  size: text('size').notNull(),
  quantity: integer('quantity').notNull().default(1),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  cartIdx: index('cart_items_cart_idx').on(table.cart_id),
  shoeIdx: index('cart_items_shoe_idx').on(table.shoe_id),
}));
