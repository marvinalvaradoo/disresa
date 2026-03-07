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

interface ProductInfo {
  name: string;
  description: string;
  sizes: string[];
  price: number;
  brand: string;
  category: string;
  imageUrl: string;
  images: string[];
}

function parseInfoFile(content: string, folderName: string): Partial<ProductInfo> {
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  let description = '';
  let sizes: string[] = [];
  let price = 0;
  let category = 'General'; // Default category
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('Tallas:')) {
      const sizesText = line.replace('Tallas:', '').trim();
      sizes = sizesText.split(/\s+/).filter(s => s);
    } else if (line.startsWith('Precio:')) {
      const priceText = line.replace('Precio:', '').trim();
      const priceMatch = priceText.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        price = parseFloat(priceMatch[0].replace(',', ''));
      }
    } else if (line.startsWith('Categoría:')) {
      category = line.replace('Categoría:', '').trim();
    } else if (!line.startsWith('Precio:') && !line.startsWith('Tallas:') && !line.startsWith('Categoría:')) {
      description += line + ' ';
    }
  }
  
  // Extract brand from folder name (first word usually)
  const nameParts = folderName.split(' ');
  const brand = nameParts[0];
  
  return {
    name: folderName,
    description: description.trim(),
    sizes,
    price,
    brand,
    category,
  };
}

async function readProductsFromFolder(): Promise<ProductInfo[]> {
  const shoesDir = path.join(process.cwd(), 'public', 'img', 'shoes');
  
  if (!fs.existsSync(shoesDir)) {
    console.log('⚠️  Shoes directory not found, creating sample products...');
    return [];
  }
  
  const products: ProductInfo[] = [];
  const folders = fs.readdirSync(shoesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  for (const folder of folders) {
    const folderPath = path.join(shoesDir, folder);
    const infoPath = path.join(folderPath, 'info.txt');
    
    if (!fs.existsSync(infoPath)) {
      console.log(`⚠️  No info.txt found in ${folder}, skipping...`);
      continue;
    }
    
    const infoContent = fs.readFileSync(infoPath, 'utf-8');
    const productInfo = parseInfoFile(infoContent, folder);
    
    // Get all image files
    const imageFiles = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
      .sort();
    
    if (imageFiles.length === 0) {
      console.log(`⚠️  No images found in ${folder}, skipping...`);
      continue;
    }
    
    const imagePaths = imageFiles.map(file => `/img/shoes/${folder}/${file}`);
    
    products.push({
      name: productInfo.name!,
      description: productInfo.description!,
      sizes: productInfo.sizes!,
      price: productInfo.price!,
      brand: productInfo.brand!,
      category: productInfo.category!,
      imageUrl: imagePaths[0],
      images: imagePaths.slice(1),
    });
  }
  
  return products;
}

async function seed() {
  console.log('🌱 Starting seed process...\n');
  
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
    
    // 2. Read products from folder
    console.log('📦 Reading products from /public/img/shoes/...');
    const products = await readProductsFromFolder();
    console.log(`✅ Found ${products.length} products\n`);
    
    // 3. Extract unique brands and categories
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    // 4. Create brands
    console.log('🏷️  Creating brands...');
    const brandMap = new Map<string, number>();
    for (const brandName of uniqueBrands) {
      const [brand] = await db.insert(schema.brands).values({
        name: brandName,
        slug: generateSlug(brandName),
      }).returning();
      brandMap.set(brandName, brand.id);
      console.log(`   ✓ ${brandName}`);
    }
    console.log('');
    
    // 5. Create categories
    console.log('📂 Creating categories...');
    const categoryMap = new Map<string, number>();
    for (const categoryName of uniqueCategories) {
      const [category] = await db.insert(schema.categories).values({
        name: categoryName,
        slug: generateSlug(categoryName),
        description: `Zapatos ${categoryName.toLowerCase()}`,
      }).returning();
      categoryMap.set(categoryName, category.id);
      console.log(`   ✓ ${categoryName}`);
    }
    console.log('');
    
    // 6. Create products
    console.log('👟 Creating products...');
    const shoeIds: number[] = [];
    for (const product of products) {
      const [shoe] = await db.insert(schema.shoes).values({
        name: product.name,
        slug: generateSlug(product.name),
        brand_id: brandMap.get(product.brand)!,
        category_id: categoryMap.get(product.category)!,
        price: product.price,
        original_price: product.price * 1.2, // 20% discount
        stock: Math.floor(Math.random() * 50) + 10,
        sizes: JSON.stringify(product.sizes),
        image_url: product.imageUrl,
        images: JSON.stringify(product.images),
        description: product.description,
        features: JSON.stringify([
          'Material de alta calidad',
          'Diseño ergonómico',
          'Suela antideslizante',
          'Transpirable',
        ]),
        is_featured: Math.random() > 0.5 ? 1 : 0,
        is_active: 1,
      }).returning();
      shoeIds.push(shoe.id);
      console.log(`   ✓ ${product.name} - Q${product.price}`);
    }
    console.log('');
    
    // 7. Create sample customers
    console.log('👥 Creating sample customers...');
    const customers = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '+502 1234-5678',
        address: 'Zona 10, Ciudad de Guatemala',
        city: 'Guatemala',
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@example.com',
        phone: '+502 2345-6789',
        address: 'Zona 15, Ciudad de Guatemala',
        city: 'Guatemala',
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@example.com',
        phone: '+502 3456-7890',
        address: 'Antigua Guatemala',
        city: 'Antigua',
      },
    ];
    
    const customerIds: number[] = [];
    for (const customer of customers) {
      const [created] = await db.insert(schema.customers).values(customer).returning();
      customerIds.push(created.id);
      console.log(`   ✓ ${customer.name}`);
    }
    console.log('');
    
    // 8. Create sample invoices
    console.log('🧾 Creating sample invoices...');
    
    if (shoeIds.length >= 2) {
      // Invoice 1
      const shoe1 = products[0];
      const shoe2 = products[1];
      const subtotal1 = shoe1.price * 2 + shoe2.price * 1;
      const tax1 = subtotal1 * 0.12;
      const total1 = subtotal1 + tax1;
      
      const [invoice1] = await db.insert(schema.invoices).values({
        invoice_number: 'DIS-2026-0001',
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
          shoe_id: shoeIds[0],
          shoe_name: shoe1.name,
          size: shoe1.sizes[0],
          quantity: 2,
          unit_price: shoe1.price,
          subtotal: shoe1.price * 2,
        },
        {
          invoice_id: invoice1.id,
          shoe_id: shoeIds[1],
          shoe_name: shoe2.name,
          size: shoe2.sizes[0],
          quantity: 1,
          unit_price: shoe2.price,
          subtotal: shoe2.price * 1,
        },
      ]);
      
      console.log(`   ✓ Invoice ${invoice1.invoice_number} - Q${total1.toFixed(2)}`);
      
      // Invoice 2
      if (shoeIds.length >= 3) {
        const shoe3 = products[2];
        const subtotal2 = shoe3.price * 1;
        const tax2 = subtotal2 * 0.12;
        const total2 = subtotal2 + tax2;
        
        const [invoice2] = await db.insert(schema.invoices).values({
          invoice_number: 'DIS-2026-0002',
          customer_id: customerIds[1],
          customer_name: customers[1].name,
          customer_email: customers[1].email,
          subtotal: subtotal2,
          tax: tax2,
          discount: 0,
          total: total2,
          status: 'pending',
          notes: 'Recoger en tienda',
          created_by: 'admin-001',
        }).returning();
        
        await db.insert(schema.invoice_items).values({
          invoice_id: invoice2.id,
          shoe_id: shoeIds[2],
          shoe_name: shoe3.name,
          size: shoe3.sizes[1] || shoe3.sizes[0],
          quantity: 1,
          unit_price: shoe3.price,
          subtotal: shoe3.price * 1,
        });
        
        console.log(`   ✓ Invoice ${invoice2.invoice_number} - Q${total2.toFixed(2)}`);
      }
    }
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${uniqueBrands.length} brands`);
    console.log(`   • ${uniqueCategories.length} categories`);
    console.log(`   • ${products.length} products`);
    console.log(`   • ${customers.length} customers`);
    console.log(`   • 2 sample invoices`);
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
