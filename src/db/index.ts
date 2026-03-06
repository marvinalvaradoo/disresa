import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use process.env for Netlify compatibility
const databaseUrl = process.env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL || 'file:./marvinbd.db';
const authToken = process.env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN || '';

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
