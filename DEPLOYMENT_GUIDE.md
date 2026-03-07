# Guía de Deployment - AV Parfums

## 📋 Pre-requisitos

- Node.js 18+ instalado
- Cuenta en Netlify o Vercel
- Base de datos Turso configurada (opcional para producción)

## 🗄️ Configuración de Base de Datos

### Opción 1: Base de datos local (SQLite)
La aplicación viene configurada para usar una base de datos SQLite local (`marvinbd.db`).

### Opción 2: Base de datos en la nube (Turso - Recomendado para producción)

1. **Crear cuenta en Turso**
   ```bash
   # Instalar Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Login
   turso auth login
   ```

2. **Crear base de datos**
   ```bash
   turso db create avparfums-db
   ```

3. **Obtener credenciales**
   ```bash
   # URL de la base de datos
   turso db show avparfums-db --url
   
   # Token de autenticación
   turso db tokens create avparfums-db
   ```

4. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   TURSO_DATABASE_URL=libsql://your-database-url.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

## 🌱 Poblar la Base de Datos

### Ejecutar el seeder de perfumes
```bash
npm run db:seed:parfums
```

Esto creará:
- ✅ 2 marcas (Armaf, Lattafa)
- ✅ 2 categorías (Men's, Women's)
- ✅ 7 productos de perfumes
- ✅ Usuario administrador
- ✅ Clientes de ejemplo
- ✅ Facturas de ejemplo

### Credenciales de Admin
```
Email: admin@avparfum.com
Password: Avparfum2026!
```

## 🚀 Deploy a Netlify

### Método 1: Deploy desde Git (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Deploy AV Parfums to production"
   git push origin main
   ```

2. **Conectar con Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración de Astro

3. **Configurar variables de entorno en Netlify**
   - Ve a Site settings → Environment variables
   - Agrega las siguientes variables:
     ```
     TURSO_DATABASE_URL=libsql://your-database-url.turso.io
     TURSO_AUTH_TOKEN=your-auth-token-here
     ```

4. **Deploy automático**
   - Netlify construirá y desplegará automáticamente
   - Build command: `npm run build`
   - Publish directory: `dist`

### Método 2: Deploy manual con Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod
```

## 🚀 Deploy a Vercel

### Método 1: Deploy desde Git (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Deploy AV Parfums to production"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New" → "Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Astro

3. **Configurar variables de entorno en Vercel**
   - Ve a Project Settings → Environment Variables
   - Agrega:
     ```
     TURSO_DATABASE_URL=libsql://your-database-url.turso.io
     TURSO_AUTH_TOKEN=your-auth-token-here
     ```

4. **Deploy automático**
   - Vercel construirá y desplegará automáticamente

### Método 2: Deploy manual con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 📦 Build Local

Para probar el build antes de desplegar:

```bash
# Build
npm run build

# Preview
npm run preview
```

## 🔧 Configuración de Producción

### netlify.toml
El proyecto ya incluye configuración para Netlify:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### vercel.json (si usas Vercel)
El proyecto ya incluye el adapter de Vercel en `astro.config.mjs`.

## 🗃️ Migración de Base de Datos

Si necesitas actualizar el esquema de la base de datos:

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push
```

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y poblada
- [ ] Build local exitoso (`npm run build`)
- [ ] Credenciales de admin funcionando
- [ ] Imágenes de productos accesibles en `/public/img/parfums/`
- [ ] Logo actualizado en `/public/new-logo.png`
- [ ] Código subido a Git

## 🔐 Seguridad

### Cambiar contraseña de admin en producción
Después del primer deploy, cambia la contraseña del admin:

1. Accede al admin: `https://tu-dominio.com/admin`
2. Inicia sesión con las credenciales por defecto
3. Actualiza la contraseña en la base de datos

### Variables de entorno sensibles
Nunca subas el archivo `.env` a Git. Usa las variables de entorno de tu plataforma de hosting.

## 📊 Monitoreo Post-Deploy

Después del deploy, verifica:

1. ✅ Homepage carga correctamente
2. ✅ Catálogo muestra los productos
3. ✅ Imágenes se cargan correctamente
4. ✅ Admin panel accesible
5. ✅ Login funciona
6. ✅ CRUD de productos funciona
7. ✅ Carrito de compras funciona
8. ✅ Responsive design en móvil

## 🆘 Troubleshooting

### Error: Database not found
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de haber ejecutado el seeder

### Error: Images not loading
- Verifica que las imágenes existan en `/public/img/parfums/`
- Revisa las rutas en la base de datos

### Error: Build failed
- Ejecuta `npm run build` localmente para ver el error
- Verifica que todas las dependencias estén instaladas

## 📞 Soporte

Para más información sobre deployment:
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)

---

**AV Parfums** - Fragancias de Lujo en Guatemala 🇬🇹
