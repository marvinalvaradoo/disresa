# AV Parfums - Transformation Complete

## Overview
The e-commerce platform has been successfully transformed from a shoe store (Disresa) to a luxury perfume store (AV Parfums) for the Guatemalan market.

## Key Changes

### 1. Branding
- **New Name**: AV Parfums
- **New Logo**: `/public/new-logo.png`
- **Color Scheme**: 
  - Primary: Black (#000000)
  - Secondary: White (#FFFFFF)
  - Accent: Gold (#D4AF37)
  - Hover Gold: (#C5A028)

### 2. Currency
- All prices are now displayed in **Guatemalan Quetzales (GTQ)**
- Format: `Q450.00`

### 3. Product Categories
The store now features two main categories:
- **Men's** - Fragancias masculinas de alta calidad
- **Women's** - Fragancias femeninas elegantes y sofisticadas

### 4. Brands
Two premium perfume brands:
- **Armaf**
- **Lattafa**

### 5. Products
7 luxury perfumes have been added to the database:

#### Men's Fragrances:
1. **Armaf Club de Nuit Lionheart** - Q450.00
2. **Armaf Odyssey Homme White Edition** - Q520.00
3. **Armaf Odyssey Mandarin Sky Vintage Edition** - Q480.00
4. **Lattafa Asad Bourbon** - Q550.00
5. **Lattafa Khamrah Dukhan** - Q580.00

#### Women's Fragrances:
6. **Armaf Club de Nuit Lionheart Woman** - Q470.00
7. **Lattafa Yara** - Q490.00

### 6. Design Updates

#### Typography
- **Display Font**: Playfair Display (serif) - for headings and elegant text
- **Body Font**: Inter (sans-serif) - for body text and UI elements

#### UI/UX Improvements
- Elegant black, white, and gold color scheme throughout
- Responsive design optimized for all devices
- Improved product cards with hover effects
- Gold accent buttons with smooth transitions
- Clean, minimalist layout focusing on product imagery
- Enhanced accessibility with proper ARIA labels

#### Homepage Features
- Hero section with elegant typography
- Category cards with icons
- Featured products grid
- Brand showcase section
- Benefits section with gold-accented icons
- Call-to-action banner

#### Catalog Page
- Sidebar filters for categories and brands
- Search functionality
- Responsive product grid
- Empty state with helpful messaging
- Breadcrumb navigation

#### Admin Panel
- Updated branding and color scheme
- Product management with full CRUD operations
- Price editing in GTQ
- Stock management
- Featured product toggle
- Active/inactive product status

### 7. Database Structure
The database schema remains compatible but now stores perfume data:
- Products stored in `shoes` table (generic product table)
- Standard perfume size: 100ml
- All prices in GTQ
- Product descriptions in Spanish

### 8. File Structure

#### New Files Created:
- `src/db/seed-parfums.ts` - Perfume database seeder
- `AV_PARFUMS_TRANSFORMATION.md` - This documentation

#### Updated Files:
- `src/layouts/Layout.astro` - New branding, fonts, and colors
- `src/pages/index.astro` - Elegant homepage design
- `src/pages/catalog/index.astro` - Updated catalog with new styling
- `src/pages/admin/products.astro` - Admin panel with new branding
- `src/styles/global.css` - Gold color scheme
- `package.json` - Added `db:seed:parfums` script

### 9. Product Images
All product images are located in:
```
/public/img/parfums/
├── Men's/
│   ├── armaf/
│   │   ├── Armaf-Club-de-Nuit-Lionheart.webp
│   │   ├── ARMAF-ODYSSEY-HOMME-WHITE-EDITION.webp
│   │   └── ARMAF-Odyssey-Mandarin-Sky-Vintage-Edition.webp
│   └── lattafa/
│       ├── Lattafa-Asad-Bourbon.webp
│       └── Khamrah-Dukhan.webp
└── Women's/
    ├── Armaf/
    │   └── CLUBDENUITLIONHEARTWOMAN.webp
    └── Lattafa/
        └── Lattafa-Yara.webp
```

## Setup Instructions

### 1. Seed the Database
Run the perfume seeder to populate the database:
```bash
npm run db:seed:parfums
```

### 2. Admin Access
- **URL**: `/admin`
- **Email**: `admin@avparfum.com`
- **Password**: `Avparfum2026!`

### 3. Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Features

### Customer Features
- Browse perfumes by category (Men's/Women's)
- Filter by brand (Armaf, Lattafa)
- Search functionality
- View detailed product information
- Add to cart
- Responsive design for mobile, tablet, and desktop

### Admin Features
- Product management (Create, Read, Update, Delete)
- Price editing in GTQ
- Stock management
- Category and brand management
- Invoice management
- Customer management
- Featured product selection

## Technical Stack
- **Framework**: Astro 5.17.1
- **UI**: React 19.2.4
- **Styling**: Tailwind CSS 4.2.1
- **Database**: LibSQL (Turso)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with jose
- **Notifications**: Sileo
- **Deployment**: Netlify/Vercel ready

## Responsive Design
The entire site is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible indicators
- Skip to main content link
- Alt text for all images
- Proper heading hierarchy

## SEO Optimizations
- Meta descriptions
- Open Graph tags
- Twitter Card tags
- Semantic HTML structure
- Fast loading times
- Optimized images

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- Add more perfume brands
- Implement customer reviews
- Add wishlist functionality
- Implement advanced filtering (price range, notes, etc.)
- Add product recommendations
- Implement email notifications
- Add multiple product images gallery
- Implement size variations (50ml, 100ml, etc.)

## Support
For any issues or questions, contact the development team.

---

**AV Parfums** - Fragancias de Lujo en Guatemala 🇬🇹
