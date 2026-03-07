# AV Parfums - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database with Perfume Data
```bash
npm run db:seed:parfums
```

This will create:
- ✅ 2 brands (Armaf, Lattafa)
- ✅ 2 categories (Men's, Women's)
- ✅ 7 perfume products
- ✅ Admin user account
- ✅ Sample customers and invoices

### 3. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:4321`

## 🔐 Admin Access

**Admin Panel**: `/admin`

**Credentials**:
- Email: `admin@avparfum.com`
- Password: `Avparfum2026!`

## 🎨 Design System

### Colors
- **Black**: `#000000` - Primary background, text
- **White**: `#FFFFFF` - Backgrounds, text on dark
- **Gold**: `#D4AF37` - Accent, buttons, highlights
- **Gold Hover**: `#C5A028` - Button hover states

### Typography
- **Display**: Playfair Display (headings, elegant text)
- **Body**: Inter (body text, UI elements)

## 📦 Products

### Men's Fragrances (5)
1. Armaf Club de Nuit Lionheart - Q450.00
2. Armaf Odyssey Homme White Edition - Q520.00
3. Armaf Odyssey Mandarin Sky Vintage Edition - Q480.00
4. Lattafa Asad Bourbon - Q550.00
5. Lattafa Khamrah Dukhan - Q580.00

### Women's Fragrances (2)
6. Armaf Club de Nuit Lionheart Woman - Q470.00
7. Lattafa Yara - Q490.00

## 🛠️ Admin Features

### Product Management
- ➕ Add new fragrances
- ✏️ Edit prices (in GTQ)
- 📊 Manage stock levels
- ⭐ Set featured products
- 🔄 Activate/deactivate products

### Access Admin Panel
1. Navigate to `/admin`
2. Login with admin credentials
3. Click "💎 Productos" to manage fragrances

## 📱 Pages

- **Homepage**: `/` - Hero, categories, featured products
- **Catalog**: `/catalog` - All products with filters
- **Product Detail**: `/catalog/[slug]` - Individual product page
- **Cart**: `/cart` - Shopping cart
- **Admin**: `/admin` - Admin dashboard
- **Products Admin**: `/admin/products` - Product management

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify
The project is configured for Netlify deployment. Simply connect your repository to Netlify.

### Deploy to Vercel
The project also supports Vercel deployment with the included adapter.

## 📝 Key Features

✅ Fully responsive design (mobile, tablet, desktop)
✅ Black, white, and gold elegant color scheme
✅ All prices in Guatemalan Quetzales (GTQ)
✅ Product filtering by category and brand
✅ Search functionality
✅ Shopping cart
✅ Admin panel for product management
✅ Accessibility compliant
✅ SEO optimized

## 🔄 Database Commands

```bash
# Seed with perfume data
npm run db:seed:parfums

# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## 📂 Project Structure

```
src/
├── components/
│   └── react/
│       ├── CartButton.tsx (updated with gold colors)
│       └── AddToCartButton.tsx
├── db/
│   ├── schema.ts (database schema)
│   ├── seed-parfums.ts (perfume seeder)
│   └── index.ts
├── layouts/
│   └── Layout.astro (main layout with new branding)
├── pages/
│   ├── index.astro (homepage)
│   ├── catalog/
│   │   ├── index.astro (catalog page)
│   │   └── [slug].astro (product detail)
│   └── admin/
│       ├── index.astro (dashboard)
│       └── products.astro (product management)
└── styles/
    └── global.css (gold color scheme)
```

## 🎯 Next Steps

1. ✅ Database seeded with perfume data
2. ✅ Admin panel updated with new branding
3. ✅ Homepage redesigned with elegant styling
4. ✅ Catalog page updated
5. ✅ All prices in GTQ
6. ✅ Color scheme: Black, White, Gold

## 💡 Tips

- Use the admin panel to edit prices and manage inventory
- All product images are in `/public/img/parfums/`
- Product descriptions are in Spanish
- Standard perfume size is 100ml
- Free shipping on orders over Q500

## 🆘 Support

For issues or questions, refer to:
- `AV_PARFUMS_TRANSFORMATION.md` - Detailed transformation documentation
- `README.md` - Original project documentation

---

**AV Parfums** - Fragancias de Lujo en Guatemala 🇬🇹
