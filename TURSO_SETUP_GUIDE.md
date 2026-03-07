# 🚀 Turso Database Setup Guide for Netlify

## What is Turso?

Turso is a cloud-based SQLite database that's perfect for production deployments. It's:
- **Fast**: Edge-deployed for low latency worldwide
- **Free tier**: Generous limits for small projects
- **SQLite compatible**: Same database you use locally
- **Scalable**: Grows with your application

---

## Step 1: Install Turso CLI

### On Windows (PowerShell):
```powershell
irm get.turso.tech/install.ps1 | iex
```

### On macOS/Linux:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Verify installation:
```bash
turso --version
```

---

## Step 2: Sign Up / Login to Turso

```bash
# This will open your browser to authenticate
turso auth signup

# Or if you already have an account
turso auth login
```

---

## Step 3: Create Your Production Database

```bash
# Create a new database called "disresa-prod"
turso db create disresa-prod

# You should see output like:
# Created database disresa-prod in [location]
# URL: libsql://disresa-prod-[your-org].turso.io
```

---

## Step 4: Get Database Credentials

### Get the Database URL:
```bash
turso db show disresa-prod --url
```

**Copy this URL** - you'll need it for Netlify.
Example: `libsql://disresa-prod-yourname.turso.io`

### Create an Auth Token:
```bash
turso db tokens create disresa-prod
```

**Copy this token** - you'll need it for Netlify.
Example: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...` (very long string)

---

## Step 5: Update Local .env File

Update your `.env` file with the Turso credentials:

```env
# Turso Production Database
TURSO_DATABASE_URL=libsql://disresa-prod-yourname.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# JWT Secret for authentication
JWT_SECRET=your-random-secret-key-here-change-this

# Environment
NODE_ENV=production
```

**Important**: Never commit the `.env` file to git! It's already in `.gitignore`.

---

## Step 6: Push Database Schema to Turso

Now that you have Turso credentials in your `.env`, push your database schema:

```bash
# This creates all the tables in Turso
npm run db:push
```

You should see output like:
```
✓ Applying migrations...
✓ Done!
```

---

## Step 7: Seed the Database with Initial Data

```bash
# This adds sample products, categories, brands, and admin user
npm run db:seed
```

You should see:
```
🌱 Starting seed process...
✅ Admin user created
   Email: admin@disresa.com
   Password: Disresa2024!
✅ Found 3 products
...
🎉 Seed completed successfully!
```

---

## Step 8: Verify Database (Optional)

You can explore your Turso database using Drizzle Studio:

```bash
npm run db:studio
```

This opens a web interface where you can see all your tables and data.

Or use Turso's shell:

```bash
turso db shell disresa-prod
```

Then run SQL queries:
```sql
SELECT * FROM users;
SELECT * FROM shoes;
```

Type `.quit` to exit.

---

## Step 9: Add Environment Variables to Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your **avparfum** site
3. Go to **Site configuration** → **Environment variables**
4. Click **Add a variable** and add these:

### Required Variables:

| Variable Name | Value | Where to get it |
|---------------|-------|-----------------|
| `TURSO_DATABASE_URL` | `libsql://disresa-prod-yourname.turso.io` | From `turso db show disresa-prod --url` |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` (long token) | From `turso db tokens create disresa-prod` |
| `NODE_ENV` | `production` | Just type "production" |
| `JWT_SECRET` | `your-random-secret-key` | Generate a random string (at least 32 characters) |

### How to add each variable:
1. Click **Add a variable**
2. Select **Add a single variable**
3. Enter the **Key** (e.g., `TURSO_DATABASE_URL`)
4. Enter the **Value** (paste your URL or token)
5. Click **Create variable**
6. Repeat for all 4 variables

---

## Step 10: Redeploy on Netlify

After adding all environment variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (usually 1-2 minutes)

---

## Step 11: Verify Everything Works

### Test the environment variables:
Visit: https://avparfum.netlify.app/test

You should see:
```json
{
  "NODE_ENV": "production",
  "TURSO_DATABASE_URL": "SET (length: 50)",
  "TURSO_AUTH_TOKEN": "SET (length: 200+)"
}
```

### Test the database connection:
Visit: https://avparfum.netlify.app/api/health

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-03-07T..."
}
```

### Test the homepage:
Visit: https://avparfum.netlify.app/

You should see your products and categories!

### Test admin login:
1. Visit: https://avparfum.netlify.app/login
2. Email: `admin@disresa.com`
3. Password: `Disresa2024!`

---

## 🎉 Success!

Your Disresa e-commerce site is now running on:
- **Frontend/Backend**: Netlify (serverless functions)
- **Database**: Turso (edge SQLite)
- **Global**: Fast worldwide with edge deployment

---

## 📊 Turso Free Tier Limits

- **Storage**: 9 GB
- **Rows read**: 1 billion/month
- **Rows written**: 25 million/month
- **Databases**: 500

This is more than enough for most small to medium e-commerce sites!

---

## 🔧 Useful Turso Commands

```bash
# List all your databases
turso db list

# Show database info
turso db show disresa-prod

# Get database URL
turso db show disresa-prod --url

# Create a new token (if you lose the old one)
turso db tokens create disresa-prod

# Delete database (careful!)
turso db destroy disresa-prod

# View database shell
turso db shell disresa-prod
```

---

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Make sure `TURSO_AUTH_TOKEN` is set correctly in Netlify
- Token might have expired - create a new one: `turso db tokens create disresa-prod`

### Error: "Database not found"
- Verify the database exists: `turso db list`
- Check the URL is correct: `turso db show disresa-prod --url`

### Error: "Table does not exist"
- You forgot to push the schema: `npm run db:push`
- Or seed the database: `npm run db:seed`

### Site shows "No products found"
- Database is empty - run: `npm run db:seed`
- Check database has data: `turso db shell disresa-prod` then `SELECT * FROM shoes;`

---

## 📚 Additional Resources

- **Turso Documentation**: https://docs.turso.tech/
- **Turso Dashboard**: https://turso.tech/app
- **Drizzle ORM Docs**: https://orm.drizzle.team/
- **Netlify Docs**: https://docs.netlify.com/

---

## 🔐 Security Notes

1. **Never commit** `.env` file to git
2. **Rotate tokens** periodically for security
3. **Use different databases** for development and production
4. **Backup important data** regularly (Turso has automatic backups)

---

Good luck! 🚀
