# 🚀 Getting Started - AVParfum Production Setup

## 📚 Two Setup Guides Created:

1. **TURSO_SETUP_GUIDE.md** - Full guide with CLI commands
2. **TURSO_WEB_SETUP.md** - Web-only guide (no CLI needed) ⭐ **Start here!**
3. **QUICK_REFERENCE.md** - Quick reference for all URLs and commands

---

## 🎯 Quick Start (Recommended Path)

Since the CLI installation isn't working right now, follow the **web dashboard approach**:

### 1. Create Turso Account & Database
- Go to: **https://turso.tech/**
- Sign up (use GitHub for fastest setup)
- Create database named: **`disresa-prod`** or **`avparfum-prod`**

### 2. Get Your Credentials
- Copy the **Database URL** (looks like: `libsql://disresa-prod-yourname.turso.io`)
- Create and copy an **Auth Token** (very long string starting with `eyJ...`)

### 3. Update Your Local .env
```env
TURSO_DATABASE_URL=libsql://disresa-prod-yourname.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...your-token-here
JWT_SECRET=your-random-secret-key-here
NODE_ENV=production
```

### 4. Push Schema & Seed Data
```bash
npm run db:push
npm run db:seed
```

### 5. Add to Netlify
- Go to **Netlify Dashboard** → Your **avparfum** site → **Environment variables**
- Add all 4 variables from your `.env` file:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`
  - `JWT_SECRET`
  - `NODE_ENV`
- Trigger a new deploy

### 6. Test Your Production Site

✅ **Test environment variables:**
Visit: **https://avparfum.netlify.app/test**
(should show all variables SET)

✅ **Test database connection:**
Visit: **https://avparfum.netlify.app/api/health**
(should show "connected")

✅ **Test homepage:**
Visit: **https://avparfum.netlify.app/**
(should show products)

✅ **Test admin login:**
Visit: **https://avparfum.netlify.app/login**
- Email: `admin@avparfum.com`
- Password: `Avparfum2026!`

---

## 🆘 Need Help?

### Option 1: Follow Detailed Guide
Open **TURSO_WEB_SETUP.md** for step-by-step instructions with screenshots

### Option 2: Quick Reference
Open **QUICK_REFERENCE.md** for all URLs, commands, and troubleshooting

### Option 3: CLI Setup (Advanced)
Open **TURSO_SETUP_GUIDE.md** if you want to use command line tools

---

## 📋 Checklist

- [ ] Created Turso account
- [ ] Created database (disresa-prod or avparfum-prod)
- [ ] Got Database URL
- [ ] Got Auth Token
- [ ] Updated local `.env` file
- [ ] Ran `npm run db:push`
- [ ] Ran `npm run db:seed`
- [ ] Added 4 variables to Netlify
- [ ] Triggered deploy on Netlify
- [ ] Tested https://avparfum.netlify.app/test
- [ ] Tested https://avparfum.netlify.app/api/health
- [ ] Tested https://avparfum.netlify.app/
- [ ] Tested admin login

---

## 🎉 Once Everything Works

Your production site will be live at:
- **Homepage**: https://avparfum.netlify.app/
- **Catalog**: https://avparfum.netlify.app/catalog
- **Admin Panel**: https://avparfum.netlify.app/admin

---

Good luck! 🚀
