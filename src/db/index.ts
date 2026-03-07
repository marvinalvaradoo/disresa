import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use process.env for Netlify compatibility
const databaseUrl = process.env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL || 'file:./marvinbd.db';
const authToken = process.env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN || '';

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN is required in production!');
  console.error('Please set it in Netlify environment variables.');
  console.error('Visit: https://app.netlify.com → Site configuration → Environment variables');
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
