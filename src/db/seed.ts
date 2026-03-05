import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:./marvinbd.db',
  authToken: process.env.TURSO_AUTH_TOKEN ?? '',
});

const db = drizzle(client, { schema });

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Usuario admin
  const hashedPassword = await hashPassword('admin123');
  await db.insert(schema.users).values({
    id: 'admin-001',
    email: 'admin@disresa.com',
    hashed_password: hashedPassword,
    role: 'admin',
  });
  console.log('✅ Admin user created');

  // 2. Categorías
  const categoriesData = [
    { name: 'Deportivos' },
    { name: 'Casuales' },
    { name: 'Formales' },
  ];
  await db.insert(schema.categories).values(categoriesData);
  console.log('✅ Categories created');

  // 3. Zapatos
  const shoesData = [
    {
      name: 'Nike Air Max 270',
      brand: 'Nike',
      category_id: 1,
      price: 149.99,
      stock: 25,
      sizes: JSON.stringify([7, 8, 9, 10, 11, 12]),
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      description: 'Zapatillas deportivas con tecnología Air Max para máxima comodidad',
    },
    {
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      category_id: 1,
      price: 179.99,
      stock: 18,
      sizes: JSON.stringify([7, 8, 9, 10, 11]),
      image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
      description: 'Running shoes con tecnología Boost para retorno de energía',
    },
    {
      name: 'Vans Old Skool',
      brand: 'Vans',
      category_id: 2,
      price: 69.99,
      stock: 40,
      sizes: JSON.stringify([6, 7, 8, 9, 10, 11, 12]),
      image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
      description: 'Zapatillas casuales clásicas con diseño icónico',
    },
    {
      name: 'Converse Chuck Taylor',
      brand: 'Converse',
      category_id: 2,
      price: 59.99,
      stock: 50,
      sizes: JSON.stringify([6, 7, 8, 9, 10, 11]),
      image_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3',
      description: 'Zapatillas casuales de lona, estilo atemporal',
    },
    {
      name: 'Clarks Desert Boot',
      brand: 'Clarks',
      category_id: 3,
      price: 129.99,
      stock: 15,
      sizes: JSON.stringify([7, 8, 9, 10, 11, 12]),
      image_url: 'https://images.unsplash.com/photo-1478186014654-93c5e0e2e0f8',
      description: 'Botas formales de cuero genuino para ocasiones especiales',
    },
  ];
  await db.insert(schema.shoes).values(shoesData);
  console.log('✅ Shoes created');

  console.log('🎉 Seeding completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
