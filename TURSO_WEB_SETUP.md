# 🌐 Turso Setup via Web Dashboard (No CLI Required)

This guide shows you how to set up Turso using only the web browser - no command line needed!

---

## Step 1: Create Turso Account

1. Go to: **https://turso.tech/**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - GitHub account (recommended)
   - Or email/password

---

## Step 2: Create Your Database

1. After logging in, you'll see the Turso Dashboard
2. Click **"Create Database"** button
3. Fill in:
   - **Name**: `disresa-prod`
   - **Location**: Choose closest to your users (or leave default)
4. Click **"Create"**

---

## Step 3: Get Database URL

1. Click on your **disresa-prod** database
2. You'll see the database details page
3. Find the **"URL"** section
4. Copy the URL - it looks like:
   ```
   libsql://disresa-prod-yourname.turso.io
   ```
5. **Save this URL** - you'll need it for Netlify

---

## Step 4: Create Auth Token

1. Still on the database details page
2. Find the **"Tokens"** or **"Authentication"** section
3. Click **"Create Token"** or **"Generate Token"**
4. Copy the token - it's a very long string like:
   ```
   eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDk...
   ```
5. **Save this token** - you'll need it for Netlify
6. ⚠️ **Important**: You can only see this token once! Save it somewhere safe.

---

## Step 5: Update Local .env File

Open your `.env` file in the project and update it:

```env
# Turso Production Database
TURSO_DATABASE_URL=libsql://disresa-prod-yourname.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# JWT Secret (generate a random string)
JWT_SECRET=change-this-to-a-random-secret-key-at-least-32-chars

# Environment
NODE_ENV=production
```

---

## Step 6: Push Database Schema

Now run these commands in your terminal:

```bash
# This creates all the tables in Turso
npm run db:push
```

You should see:
```
✓ Applying migrations...
✓ Done!
```

---

## Step 7: Add Sample Data

```bash
# This adds products, categories, brands, and admin user
npm run db:seed
```

You should see:
```
🌱 Starting seed process...
✅ Admin user created
   Email: admin@disresa.com
   Password: Disresa2024!
🎉 Seed completed successfully!
```

---

## Step 8: Add Environment Variables to Netlify

1. Go to: **https://app.netlify.com**
2. Select your **avparfum** site
3. Go to: **Site configuration** → **Environment variables**
4. Add these 4 variables:

### Variable 1: TURSO_DATABASE_URL
- Click **"Add a variable"**
- Key: `TURSO_DATABASE_URL`
- Value: Paste your database URL from Step 3
- Click **"Create variable"**

### Variable 2: TURSO_AUTH_TOKEN
- Click **"Add a variable"**
- Key: `TURSO_AUTH_TOKEN`
- Value: Paste your token from Step 4
- Click **"Create variable"**

### Variable 3: NODE_ENV
- Click **"Add a variable"**
- Key: `NODE_ENV`
- Value: `production`
- Click **"Create variable"**

### Variable 4: JWT_SECRET
- Click **"Add a variable"**
- Key: `JWT_SECRET`
- Value: Any random string (at least 32 characters)
  - Example: `my-super-secret-jwt-key-2024-disresa-production`
- Click **"Create variable"**

---

## Step 9: Redeploy on Netlify

1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait 1-2 minutes for deployment

---

## Step 10: Test Your Site

### Test 1: Check Environment Variables
Visit: **https://avparfum.netlify.app/test**

Should show:
```json
{
  "NODE_ENV": "production",
  "TURSO_DATABASE_URL": "SET (length: 50)",
  "TURSO_AUTH_TOKEN": "SET (length: 200+)"
}
```

### Test 2: Check Database Connection
Visit: **https://avparfum.netlify.app/api/health**

Should show:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Test 3: Check Homepage
Visit: **https://avparfum.netlify.app/**

Should show your products and categories!

### Test 4: Login to Admin
1. Visit: **https://avparfum.netlify.app/login**
2. Email: `admin@disresa.com`
3. Password: `Disresa2024!`
4. Should redirect to admin panel

---

## 🎉 Done!

Your site is now live with Turso database!

---

## 📊 View Your Data in Turso Dashboard

1. Go back to: **https://turso.tech/app**
2. Click on **disresa-prod** database
3. You can:
   - View tables
   - Run SQL queries
   - See database statistics
   - Monitor usage

---

## 🔧 Useful Turso Dashboard Features

### Run SQL Queries
In the Turso dashboard, you can run queries like:

```sql
-- See all products
SELECT * FROM shoes;

-- See all users
SELECT * FROM users;

-- Count products
SELECT COUNT(*) FROM shoes;

-- See categories
SELECT * FROM categories;
```

### View Database Stats
- Storage used
- Number of rows
- Query performance
- Connection logs

---

## 🆘 Troubleshooting

### "Authentication failed" error
- Go to Turso dashboard
- Create a new token
- Update `TURSO_AUTH_TOKEN` in Netlify
- Redeploy

### "No products found" on homepage
- Make sure you ran `npm run db:seed`
- Check in Turso dashboard if tables have data
- Run: `SELECT * FROM shoes;` in the SQL console

### "Database not found" error
- Verify database name is exactly `disresa-prod`
- Check the URL is correct in Netlify environment variables

---

## 📚 Resources

- **Turso Dashboard**: https://turso.tech/app
- **Turso Docs**: https://docs.turso.tech/
- **Netlify Dashboard**: https://app.netlify.com/

---

Good luck! 🚀
