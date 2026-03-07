# 🚀 Quick Reference - AVParfum Production

## 🌐 Production URLs

| Purpose | URL |
|---------|-----|
| **Homepage** | https://avparfum.netlify.app/ |
| **Catalog** | https://avparfum.netlify.app/catalog |
| **Admin Login** | https://avparfum.netlify.app/login |
| **Admin Panel** | https://avparfum.netlify.app/admin |
| **Test Page** | https://avparfum.netlify.app/test |
| **Health Check** | https://avparfum.netlify.app/api/health |

---

## 🔐 Admin Credentials

```
Email: admin@avparfum.com
Password: Avparfum2026!
```

---

## 🗄️ Turso Database Setup Checklist

- [ ] Create Turso account at https://turso.tech/
- [ ] Create database named `disresa-prod` (or your preferred name)
- [ ] Copy Database URL (libsql://...)
- [ ] Create and copy Auth Token (eyJ...)
- [ ] Update local `.env` file
- [ ] Run `npm run db:push` to create tables
- [ ] Run `npm run db:seed` to add sample data
- [ ] Add 4 environment variables to Netlify:
  - [ ] `TURSO_DATABASE_URL`
  - [ ] `TURSO_AUTH_TOKEN`
  - [ ] `NODE_ENV` = `production`
  - [ ] `JWT_SECRET` = (random string)
- [ ] Trigger deploy on Netlify
- [ ] Test all URLs above

---

## 📋 Environment Variables (Netlify)

Go to: https://app.netlify.com → avparfum site → Site configuration → Environment variables

| Variable | Example Value | Where to Get |
|----------|---------------|--------------|
| `TURSO_DATABASE_URL` | `libsql://disresa-prod-yourname.turso.io` | Turso Dashboard → Database → URL |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` (very long) | Turso Dashboard → Database → Create Token |
| `NODE_ENV` | `production` | Just type "production" |
| `JWT_SECRET` | `my-secret-key-2024-avparfum` | Any random string (32+ chars) |

---

## 🛠️ Local Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:4321

# Database commands
npm run db:push      # Create/update tables
npm run db:seed      # Add sample data
npm run db:studio    # Open database GUI
npm run db:generate  # Generate migrations

# Build for production
npm run build
npm run preview      # Preview production build
```

---

## 🔍 Troubleshooting Quick Checks

### 1. Check Environment Variables
Visit: https://avparfum.netlify.app/test

✅ All should show "SET" with lengths
❌ If "NOT SET", add to Netlify environment variables

### 2. Check Database Connection
Visit: https://avparfum.netlify.app/api/health

✅ Should show: `{"status":"ok","database":"connected"}`
❌ If error, check Turso credentials

### 3. Check Products Loading
Visit: https://avparfum.netlify.app/

✅ Should show products and categories
❌ If empty, run `npm run db:seed` locally

### 4. Check Admin Access
Visit: https://avparfum.netlify.app/login

✅ Should login with admin credentials
❌ If fails, check JWT_SECRET is set

---

## 📊 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Admin/staff accounts | email, role, hashed_password |
| `categories` | Product categories | name, slug |
| `brands` | Shoe brands | name, slug, logo_url |
| `shoes` | Products | name, price, stock, sizes, images |
| `customers` | Customer info | name, email, phone, address |
| `invoices` | Sales records | invoice_number, total, status |
| `invoice_items` | Invoice line items | shoe_id, quantity, unit_price |
| `carts` | Shopping carts | id, customer_email, expires_at |
| `cart_items` | Cart contents | cart_id, shoe_id, size, quantity |

---

## 🚀 Deployment Workflow

### When you make changes:

```bash
# 1. Test locally
npm run dev

# 2. Commit changes
git add .
git commit -m "Your change description"

# 3. Push to GitHub
git push origin main

# 4. Netlify auto-deploys (1-2 minutes)
# Check: https://app.netlify.com → Deploys tab
```

### Manual deploy:
1. Go to Netlify Dashboard
2. Deploys tab
3. Click "Trigger deploy" → "Deploy site"

---

## 📱 API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/shoes` | List products | No |
| GET | `/api/shoes/:id` | Get product | No |
| POST | `/api/shoes` | Create product | Admin |
| PUT | `/api/shoes` | Update product | Admin |
| DELETE | `/api/shoes/:id` | Delete product | Admin |
| GET | `/api/categories` | List categories | No |
| GET | `/api/brands` | List brands | No |
| GET | `/api/cart` | Get cart | No |
| POST | `/api/cart` | Create cart | No |
| POST | `/api/cart/items` | Add to cart | No |
| PUT | `/api/cart/items` | Update cart item | No |
| DELETE | `/api/cart/items/:id` | Remove from cart | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Current user | Yes |
| GET | `/api/invoices` | List invoices | Admin |
| POST | `/api/invoices` | Create invoice | Admin |

---

## 🎨 Brand Colors

```css
Primary Blue: #0061bd
Primary Yellow: #fef24e
Light Yellow: #fdfad7
Dark Blue: #004a94
Black: #000000
White: #ffffff
```

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Database table definitions |
| `src/db/index.ts` | Database connection |
| `src/lib/auth.ts` | Authentication helpers |
| `src/pages/index.astro` | Homepage |
| `src/pages/catalog/index.astro` | Product catalog |
| `src/pages/admin/products.astro` | Admin product management |
| `astro.config.mjs` | Astro configuration |
| `drizzle.config.ts` | Database configuration |
| `.env` | Environment variables (local) |

---

## 🆘 Support Resources

- **Turso Dashboard**: https://turso.tech/app
- **Netlify Dashboard**: https://app.netlify.com
- **Astro Docs**: https://docs.astro.build
- **Drizzle ORM Docs**: https://orm.drizzle.team
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

---

## 📝 Notes

- Database name: `disresa-prod` (or your chosen name)
- Admin email: `admin@avparfum.com`
- Session expires: 24 hours
- Cart expires: 7 days
- Free Turso tier: 9GB storage, 1B reads/month

---

Last updated: March 7, 2026
