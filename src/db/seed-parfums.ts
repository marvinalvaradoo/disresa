import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:./marvinbd.db',
  authToken: process.env.TURSO_AUTH_TOKEN ?? '',
});

const db = drizzle(client, { schema });

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface ParfumInfo {
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  imageUrl: string;
}

const parfumsData: ParfumInfo[] = [
  // Men's - Armaf
  {
    name: 'Armaf Club de Nuit Lionheart',
    description: 'Armaf Club de Nuit Lionheart es una fragancia de larga duración que comienza con una apertura fresca y energizante, seguida por una suave dulzura cálida que aporta equilibrio y elegancia. Su fondo intenso y ligeramente ahumado crea un aroma profundo y envolvente, con una estela atractiva que perdura durante horas. Es una fragancia audaz, acogedora y con gran aceptación, ideal para quienes buscan un perfume de alta calidad y con carácter cautivador.',
    price: 450.00,
    brand: 'Armaf',
    category: "Men's",
    imageUrl: "/img/parfums/Men's/armaf/Armaf-Club-de-Nuit-Lionheart.webp"
  },
  {
    name: 'Armaf Odyssey Homme White Edition',
    description: 'Odyssey Homme White Edition es una fragancia masculina que refleja un estilo carismático, fresco y de espíritu libre. Su apertura combina menta, pimienta rosa y cardamomo, creando una primera impresión vibrante y especiada. En el corazón, la salvia herbácea y la piña afrutada se mezclan con acordes acuáticos, aportando una sensación fresca y moderna. Finalmente, las notas de madera de cedro, amberwood y vainilla aportan profundidad al aroma.',
    price: 520.00,
    brand: 'Armaf',
    category: "Men's",
    imageUrl: "/img/parfums/Men's/armaf/ARMAF-ODYSSEY-HOMME-WHITE-EDITION.webp"
  },
  {
    name: 'Armaf Odyssey Mandarin Sky Vintage Edition',
    description: 'Odyssey Mandarin Sky Vintage Edition es una fragancia radiante que realza cada momento. Su apertura destaca por una explosión de mandarina jugosa y notas cítricas, despertando los sentidos y transmitiendo una sensación inmediata de frescura y confianza. En el corazón, delicadas notas florales se mezclan con especias cálidas, creando una composición elegante y memorable. Una opción perfecta para quienes buscan sofisticación atemporal con un toque moderno.',
    price: 480.00,
    brand: 'Armaf',
    category: "Men's",
    imageUrl: "/img/parfums/Men's/armaf/ARMAF-Odyssey-Mandarin-Sky-Vintage-Edition.webp"
  },
  // Men's - Lattafa
  {
    name: 'Lattafa Asad Bourbon',
    description: 'Lattafa Asad Bourbon Eau de Parfum es una fragancia unisex que combina perfectamente elegancia, carácter y sofisticación. Su apertura presenta una mezcla vibrante de pimienta rosa, lavanda y mirabelle (ciruela amarilla), creando una primera impresión fresca, aromática y envolvente. En el corazón, la fragancia desarrolla mayor profundidad con una cálida combinación de cacao, nuez moscada y davana. Una fragancia versátil e intensa, ideal para quienes buscan un equilibrio entre audacia y refinamiento.',
    price: 550.00,
    brand: 'Lattafa',
    category: "Men's",
    imageUrl: "/img/parfums/Men's/lattafa/Lattafa-Asad-Bourbon.webp"
  },
  {
    name: 'Lattafa Khamrah Dukhan',
    description: 'Khamrah Dukhan es una fragancia inspirada en una antigua tradición de Medio Oriente. Su nombre "Dukhan", que significa humo, hace referencia al ritual de quemar perfumes, creando una atmósfera intensa, misteriosa y profundamente cautivadora. Con un carácter etéreo e hipnótico, esta fragancia captura la esencia del humo en movimiento, combinando profundidad, elegancia y una estela sofisticada. Su composición mezcla pimienta, tabaco y ámbar, logrando un aroma audaz, cálido y con una energía envolvente.',
    price: 580.00,
    brand: 'Lattafa',
    category: "Men's",
    imageUrl: "/img/parfums/Men's/lattafa/Khamrah-Dukhan.webp"
  },
  // Women's - Armaf
  {
    name: 'Armaf Club de Nuit Lionheart Woman',
    description: 'LionHeart para mujer de Armaf es una fragancia diseñada para quienes reflejan elegancia, encanto y personalidad. Su aroma cautivador se abre con lavanda suave y vainilla dulce, creando una primera impresión delicada y envolvente. En el corazón, se desarrolla una combinación cálida de cacao intenso y jengibre especiado, que aporta profundidad y un carácter atractivo. Creado por la reconocida casa de perfumes Armaf, este Eau de Parfum ofrece una mezcla perfecta de sofisticación, dulzura y calidez.',
    price: 470.00,
    brand: 'Armaf',
    category: "Women's",
    imageUrl: "/img/parfums/Women's/Armaf/CLUBDENUITLIONHEARTWOMAN.webp"
  },
  // Women's - Lattafa
  {
    name: 'Lattafa Yara',
    description: 'Yara es una fragancia jugosa, floral y adictiva que transmite suavidad, pero deja una impresión duradera. Combina calidez tropical, flores cremosas y un toque dulce irresistible, logrando un aroma que es dulce pero sofisticado, delicado pero cautivador. Su composición mezcla orquídea, mandarina y vainilla, creando una fragancia femenina, juguetona y encantadora, con un carácter soñador y delicioso. Diseñada para mujeres que irradian calidez, encanto y una elegancia natural.',
    price: 490.00,
    brand: 'Lattafa',
    category: "Women's",
    imageUrl: "/img/parfums/Women's/Lattafa/Lattafa-Yara.webp"
  }
];

async function seed() {
  console.log('🌱 Starting AV Parfums seed process...\n');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(schema.invoice_items);
    await db.delete(schema.invoices);
    await db.delete(schema.cart_items);
    await db.delete(schema.carts);
    await db.delete(schema.shoes);
    await db.delete(schema.customers);
    await db.delete(schema.categories);
    await db.delete(schema.brands);
    await db.delete(schema.users);
    console.log('✅ Data cleared\n');
    
    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('Avparfum2026!', 10);
    await db.insert(schema.users).values({
      id: 'admin-001',
      email: 'admin@avparfum.com',
      hashed_password: hashedPassword,
      role: 'admin',
      name: 'Administrator',
    });
    console.log('✅ Admin user created');
    console.log('   Email: admin@avparfum.com');
    console.log('   Password: Avparfum2026!\n');
    
    // 2. Create brands
    console.log('🏷️  Creating brands...');
    const brandMap = new Map<string, number>();
    const uniqueBrands = ['Armaf', 'Lattafa'];
    
    for (const brandName of uniqueBrands) {
      const [brand] = await db.insert(schema.brands).values({
        name: brandName,
        slug: generateSlug(brandName),
      }).returning();
      brandMap.set(brandName, brand.id);
      console.log(`   ✓ ${brandName}`);
    }
    console.log('');
    
    // 3. Create categories
    console.log('📂 Creating categories...');
    const categoryMap = new Map<string, number>();
    const categories = [
      { name: "Men's", description: 'Fragancias masculinas de alta calidad' },
      { name: "Women's", description: 'Fragancias femeninas elegantes y sofisticadas' }
    ];
    
    for (const cat of categories) {
      const [category] = await db.insert(schema.categories).values({
        name: cat.name,
        slug: generateSlug(cat.name),
        description: cat.description,
      }).returning();
      categoryMap.set(cat.name, category.id);
      console.log(`   ✓ ${cat.name}`);
    }
    console.log('');
    
    // 4. Create products
    console.log('💎 Creating perfume products...');
    const productIds: number[] = [];
    for (const parfum of parfumsData) {
      const [product] = await db.insert(schema.shoes).values({
        name: parfum.name,
        slug: generateSlug(parfum.name),
        brand_id: brandMap.get(parfum.brand)!,
        category_id: categoryMap.get(parfum.category)!,
        price: parfum.price,
        original_price: null,
        stock: Math.floor(Math.random() * 30) + 10,
        sizes: JSON.stringify(['100ml']), // Standard perfume size
        image_url: parfum.imageUrl,
        images: JSON.stringify([]),
        description: parfum.description,
        features: JSON.stringify([
          'Eau de Parfum de larga duración',
          'Fragancia original',
          'Presentación elegante',
          'Ideal para uso diario y ocasiones especiales',
        ]),
        is_featured: Math.random() > 0.4 ? 1 : 0,
        is_active: 1,
      }).returning();
      productIds.push(product.id);
      console.log(`   ✓ ${parfum.name} - Q${parfum.price.toFixed(2)}`);
    }
    console.log('');
    
    // 5. Create sample customers
    console.log('👥 Creating sample customers...');
    const customers = [
      {
        name: 'Ana María López',
        email: 'ana.lopez@example.com',
        phone: '+502 1234-5678',
        address: 'Zona 10, Ciudad de Guatemala',
        city: 'Guatemala',
      },
      {
        name: 'Carlos Méndez',
        email: 'carlos.mendez@example.com',
        phone: '+502 2345-6789',
        address: 'Zona 15, Ciudad de Guatemala',
        city: 'Guatemala',
      },
    ];
    
    const customerIds: number[] = [];
    for (const customer of customers) {
      const [created] = await db.insert(schema.customers).values(customer).returning();
      customerIds.push(created.id);
      console.log(`   ✓ ${customer.name}`);
    }
    console.log('');
    
    // 6. Create sample invoices
    console.log('🧾 Creating sample invoices...');
    
    if (productIds.length >= 2) {
      const parfum1 = parfumsData[0];
      const parfum2 = parfumsData[1];
      const subtotal1 = parfum1.price * 1 + parfum2.price * 1;
      const tax1 = subtotal1 * 0.12;
      const total1 = subtotal1 + tax1;
      
      const [invoice1] = await db.insert(schema.invoices).values({
        invoice_number: 'AVP-2026-0001',
        customer_id: customerIds[0],
        customer_name: customers[0].name,
        customer_email: customers[0].email,
        subtotal: subtotal1,
        tax: tax1,
        discount: 0,
        total: total1,
        status: 'paid',
        notes: 'Entrega a domicilio',
        created_by: 'admin-001',
      }).returning();
      
      await db.insert(schema.invoice_items).values([
        {
          invoice_id: invoice1.id,
          shoe_id: productIds[0],
          shoe_name: parfum1.name,
          size: '100ml',
          quantity: 1,
          unit_price: parfum1.price,
          subtotal: parfum1.price * 1,
        },
        {
          invoice_id: invoice1.id,
          shoe_id: productIds[1],
          shoe_name: parfum2.name,
          size: '100ml',
          quantity: 1,
          unit_price: parfum2.price,
          subtotal: parfum2.price * 1,
        },
      ]);
      
      console.log(`   ✓ Invoice ${invoice1.invoice_number} - Q${total1.toFixed(2)}`);
    }
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 2 brands (Armaf, Lattafa)`);
    console.log(`   • 2 categories (Men's, Women's)`);
    console.log(`   • ${parfumsData.length} perfume products`);
    console.log(`   • ${customers.length} customers`);
    console.log(`   • 1 sample invoice`);
    console.log('\n🔐 Admin credentials:');
    console.log('   Email: admin@avparfum.com');
    console.log('   Password: Avparfum2026!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
