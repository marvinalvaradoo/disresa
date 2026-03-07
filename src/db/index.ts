import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use process.env for Netlify compatibility
const databaseUrl = process.env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL || 'file:./marvinbd.db';
const authToken = process.env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN || '';

try {
  console.log('🔍 [DB] Initializing database connection...');
  console.log('🔍 [DB] Database URL:', databaseUrl);
  console.log('🔍 [DB] Auth Token:', authToken ? `SET (length: ${authToken.length})` : 'NOT SET');
  console.log('🔍 [DB] NODE_ENV:', process.env.NODE_ENV);

  // Validate required environment variables in production
  if (process.env.NODE_ENV === 'production' && !authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required in production!');
  }
} catch (error) {
  console.error('❌ [DB] Error during initialization:', error);
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

console.log('✅ [DB] Database client created successfully');

export const db = drizzle(client, { schema });
