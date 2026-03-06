import type { APIRoute } from 'astro';
import { db } from '../../db';
import { shoes } from '../../db/schema';

export const GET: APIRoute = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasTursoDatabaseUrl: !!process.env.TURSO_DATABASE_URL,
      hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
      databaseUrl: process.env.TURSO_DATABASE_URL?.substring(0, 20) + '...',
    },
    database: {
      connected: false,
      error: null as string | null,
      shoeCount: 0,
    }
  };

  try {
    const result = await db.select().from(shoes).limit(1);
    diagnostics.database.connected = true;
    diagnostics.database.shoeCount = result.length;
  } catch (error) {
    diagnostics.database.connected = false;
    diagnostics.database.error = error instanceof Error ? error.message : String(error);
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
