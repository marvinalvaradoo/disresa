# 🛒 E-Commerce Disresa

Sistema de e-commerce moderno para tienda de zapatos, construido con Astro, React, Tailwind CSS y Drizzle ORM.

![Node.js](https://img.shields.io/badge/Node.js-24.12.0-green?logo=node.js)
![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle)
![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?logo=sqlite)

## 📋 Descripción

E-Commerce Disresa es una plataforma completa de comercio electrónico especializada en la venta de zapatos. El sistema incluye gestión de inventario, categorías, facturación y administración de usuarios con roles.

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Astro SSR)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │   Layouts    │  │  Components  │     │
│  │  (Astro)     │  │   (Astro)    │  │ (Astro/React)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES (Astro)                       │
│              /api/* - Serverless Functions                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DRIZZLE ORM LAYER                         │
│              Type-safe Database Operations                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│  Local: SQLite (marvinbd.db)                               │
│  Production: Turso (libSQL)                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 24.12.0 | Runtime de JavaScript |
| **Astro** | 5.x | Framework web SSR |
| **React** | 19.x | Islands interactivos |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Estilos utility-first |
| **Drizzle ORM** | 0.45.x | ORM type-safe |
| **@libsql/client** | 0.17.x | Cliente SQLite/Turso |
| **Sileo** | 0.1.5 | Sistema de notificaciones toast |
| **SQLite** | - | Base de datos local |
| **Netlify** | - | Plataforma de deploy |

## 📦 Requisitos Previos

- **Node.js**: 24.12.0 o superior
- **npm**: Incluido con Node.js
- **Git**: Para control de versiones
- **Windows 11 Pro**: Sistema operativo (compatible con otros)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ecommerce-disresa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

### 4. Inicializar la base de datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Insertar datos de prueba
npm run db:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4321`

## 🔐 Variables de Entorno

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `TURSO_DATABASE_URL` | URL de la base de datos SQLite/Turso | `file:./marvinbd.db` | ✅ |
| `TURSO_AUTH_TOKEN` | Token de autenticación para Turso | - | ❌ (solo producción) |

### Configuración Local vs Producción

**Desarrollo Local (SQLite):**
```env
TURSO_DATABASE_URL=file:./marvinbd.db
TURSO_AUTH_TOKEN=
```

**Producción (Turso):**
```env
TURSO_DATABASE_URL=libsql://tu-db.turso.io
TURSO_AUTH_TOKEN=tu-token-secreto-aqui
```

## 📜 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en modo watch |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run db:generate` | Genera migraciones SQL desde el schema |
| `npm run db:push` | Aplica el schema directamente a la base de datos |
| `npm run db:migrate` | Ejecuta las migraciones pendientes |
| `npm run db:studio` | Abre Drizzle Studio para explorar la base de datos |
| `npm run db:seed` | Inserta datos de prueba en la base de datos |

## 📁 Estructura del Proyecto

```
ecommerce-disresa/
├── src/
│   ├── db/
│   │   ├── schema.ts          # Definición de tablas Drizzle
│   │   ├── index.ts           # Cliente de conexión a DB
│   │   └── seed.ts            # Script de datos de prueba
│   ├── pages/
│   │   ├── api/               # API endpoints serverless
│   │   └── index.astro        # Página principal
│   ├── components/
│   │   ├── astro/             # Componentes Astro
│   │   └── react/             # Componentes React (islands)
│   ├── layouts/
│   │   └── Layout.astro       # Layout base con Tailwind
│   └── styles/
│       └── global.css         # Estilos globales Tailwind
├── drizzle/                   # Migraciones generadas
├── public/                    # Archivos estáticos
├── .env                       # Variables de entorno (no commitear)
├── .env.example               # Ejemplo de variables de entorno
├── astro.config.mjs           # Configuración de Astro
├── drizzle.config.ts          # Configuración de Drizzle Kit
├── tsconfig.json              # Configuración de TypeScript
├── tailwind.config.js         # Configuración de Tailwind
├── package.json               # Dependencias y scripts
├── marvinbd.db                # Base de datos SQLite local
└── README.md                  # Este archivo
```

### Descripción de Archivos Clave

- **src/db/schema.ts**: Define las 5 tablas del sistema (users, categories, shoes, invoices, invoice_items) con sus relaciones y índices
- **src/db/index.ts**: Exporta la instancia de Drizzle configurada con @libsql/client
- **src/db/seed.ts**: Script que inserta 1 admin, 3 categorías y 5 zapatos de ejemplo
- **astro.config.mjs**: Configuración SSR con adapter Vercel serverless
- **drizzle.config.ts**: Configuración para Drizzle Kit (migraciones y studio)

## 🗄️ Base de Datos

### Esquema de Tablas

#### 1. users
- `id` (TEXT, PK): Identificador único
- `email` (TEXT, UNIQUE): Email del usuario
- `hashed_password` (TEXT): Contraseña hasheada
- `role` (TEXT): 'admin' | 'staff'
- `created_at` (INTEGER): Timestamp de creación

#### 2. categories
- `id` (INTEGER, PK, AUTOINCREMENT): ID de categoría
- `name` (TEXT): Nombre de la categoría

#### 3. shoes
- `id` (INTEGER, PK, AUTOINCREMENT): ID del zapato
- `name` (TEXT): Nombre del producto
- `brand` (TEXT): Marca
- `category_id` (INTEGER, FK): Referencia a categories
- `price` (REAL): Precio
- `stock` (INTEGER): Cantidad en inventario
- `sizes` (TEXT): Array JSON de tallas disponibles
- `image_url` (TEXT): URL de la imagen
- `description` (TEXT): Descripción del producto
- `created_at` (INTEGER): Timestamp de creación

#### 4. invoices
- `id` (INTEGER, PK, AUTOINCREMENT): ID de factura
- `invoice_number` (TEXT, UNIQUE): Número de factura
- `customer_name` (TEXT): Nombre del cliente
- `customer_email` (TEXT): Email del cliente
- `total` (REAL): Total de la factura
- `status` (TEXT): 'pending' | 'paid' | 'cancelled'
- `created_at` (INTEGER): Timestamp de creación
- `created_by` (TEXT, FK): Referencia a users

#### 5. invoice_items
- `id` (INTEGER, PK, AUTOINCREMENT): ID del item
- `invoice_id` (INTEGER, FK): Referencia a invoices
- `shoe_id` (INTEGER, FK): Referencia a shoes
- `quantity` (INTEGER): Cantidad
- `unit_price` (REAL): Precio unitario
- `subtotal` (REAL): Subtotal del item

### Índices Creados

- `shoes_category_idx`: Índice en shoes.category_id
- `invoices_status_idx`: Índice en invoices.status
- `invoices_created_by_idx`: Índice en invoices.created_by
- `invoice_items_invoice_idx`: Índice en invoice_items.invoice_id
- `invoice_items_shoe_idx`: Índice en invoice_items.shoe_id

### Local vs Producción

**Desarrollo Local:**
- Base de datos: `marvinbd.db` (SQLite)
- Ubicación: Raíz del proyecto
- Driver: `@libsql/client` con `file:` protocol

**Producción (Turso):**
- Base de datos: Turso (libSQL compatible con SQLite)
- Conexión: HTTPS con autenticación
- Driver: `@libsql/client` con `libsql:` protocol
- Ventajas: Edge deployment, replicación global, backups automáticos

## 🌐 API Endpoints

| Método | Ruta | Descripción | Estado |
|--------|------|-------------|--------|
| GET | `/api/shoes` | Listar todos los zapatos | 🔜 Pendiente |
| GET | `/api/shoes/:id` | Obtener zapato por ID | 🔜 Pendiente |
| POST | `/api/shoes` | Crear nuevo zapato | 🔜 Pendiente |
| PUT | `/api/shoes/:id` | Actualizar zapato | 🔜 Pendiente |
| DELETE | `/api/shoes/:id` | Eliminar zapato | 🔜 Pendiente |
| GET | `/api/categories` | Listar categorías | 🔜 Pendiente |
| POST | `/api/invoices` | Crear factura | 🔜 Pendiente |
| GET | `/api/invoices/:id` | Obtener factura | 🔜 Pendiente |
| POST | `/api/auth/login` | Iniciar sesión | 🔜 Pendiente |
| POST | `/api/auth/logout` | Cerrar sesión | 🔜 Pendiente |

## 🚀 Deploy en Netlify

### Guía Completa

Para instrucciones detalladas de deploy, consulta: **[DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)**

### Resumen Rápido

1. **Instalar adaptador:**
```bash
npm install @astrojs/netlify
```

2. **Configurar Turso:**
```bash
turso db create marvinbd-prod
turso db show marvinbd-prod --url
turso db tokens create marvinbd-prod
```

3. **Push a GitHub:**
```bash
git push origin main
```

4. **Deploy en Netlify:**
   - Importar proyecto desde GitHub
   - Configurar variables de entorno
   - Deploy automático

### Variables de Entorno en Netlify

| Variable | Descripción |
|----------|-------------|
| `TURSO_DATABASE_URL` | URL de base de datos Turso |
| `TURSO_AUTH_TOKEN` | Token de autenticación |
| `JWT_SECRET` | Secret para JWT |
| `NODE_ENV` | `production` |

---

## 🔔 Sistema de Notificaciones

El proyecto usa **Sileo** para notificaciones toast modernas:

- ✅ Notificaciones de éxito (verde)
- ❌ Notificaciones de error (rojo)
- ⚠️ Notificaciones de advertencia (amarillo)
- ℹ️ Notificaciones de información (azul)
- 🔘 Confirmaciones con botones

**Características:**
- Fondo negro personalizado
- Texto amarillo/blanco (colores de marca)
- Animaciones fluidas
- Posicionamiento inteligente
- Reemplaza `alert()` y `confirm()` del navegador

Para más detalles, consulta: **[SILEO_USAGE.md](./SILEO_USAGE.md)**

---

## 🔑 Credenciales de Prueba

Después de ejecutar `npm run db:seed`, puedes usar estas credenciales:

| Campo | Valor |
|-------|-------|
| **Email** | admin@avparfum.com |
| **Password** | Avparfum2026! |
| **Role** | admin |

## 🛠️ Desarrollo

### Explorar la base de datos

```bash
npm run db:studio
```

Esto abrirá Drizzle Studio en tu navegador donde podrás:
- Ver todas las tablas y sus datos
- Ejecutar queries SQL
- Editar registros directamente
- Explorar relaciones entre tablas

### Agregar nuevas tablas

1. Edita `src/db/schema.ts`
2. Ejecuta `npm run db:generate` para crear la migración
3. Ejecuta `npm run db:push` para aplicar los cambios

### Crear API endpoints

Crea archivos en `src/pages/api/` con extensión `.ts`:

```typescript
// src/pages/api/shoes.ts
import type { APIRoute } from 'astro';
import { db } from '../../db';
import { shoes } from '../../db/schema';

export const GET: APIRoute = async () => {
  const allShoes = await db.select().from(shoes);
  return new Response(JSON.stringify(allShoes), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

## 📝 Notas Importantes

- El proyecto usa **TypeScript estricto** para máxima seguridad de tipos
- **Astro SSR** permite renderizado del lado del servidor para mejor SEO
- **React islands** se usan solo para componentes interactivos
- **Drizzle ORM** proporciona type-safety completo en las queries
- **@libsql/client** es compatible tanto con SQLite local como Turso en producción
- El adaptador **Netlify** optimiza el deploy para funciones serverless
- **Sileo** reemplaza todos los `alert()` y `confirm()` nativos del navegador

## 📚 Documentación Adicional

- **[documentation.md](./documentation.md)** - Documentación técnica completa
- **[DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)** - Guía de deploy en Netlify
- **[SILEO_USAGE.md](./SILEO_USAGE.md)** - Guía de uso de notificaciones Sileo
- **[ACCESSIBILITY_CHECKLIST.md](./ACCESSIBILITY_CHECKLIST.md)** - Checklist de accesibilidad
- **[ADMIN_PRODUCTS_GUIDE.md](./ADMIN_PRODUCTS_GUIDE.md)** - Guía del panel de administración

## 🤝 Contribución

Este es un proyecto privado de Disresa. Para contribuir:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Commit tus cambios: `git commit -m 'Add: nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## 📄 Licencia

Todos los derechos reservados © 2026 Disresa

## 📞 Soporte

Para soporte técnico, contacta a: admin@avparfum.com

---

Desarrollado con ❤️ por el equipo de Disresa
