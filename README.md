# BizCraft - Multi-Tenant E-Commerce Platform

BizCraft is a modern, multi-tenant e-commerce platform built with Next.js 15, TypeScript, and Prisma. Each business gets its own store accessible via a unique slug-based route.

## Features

- **Multi-Tenant Architecture**: Each store has its own URL slug (`/[storeSlug]`)
- **Storefront**: Public-facing store pages with product listings, cart, and checkout
- **Admin Dashboard**: Complete management interface for store owners
- **Product Management**: Create, edit, and manage products
- **Order Management**: View and track orders
- **Store Settings**: Configure store information and payment providers
- **Future AI Integration**: Ready for AI-powered content generation (TODOs marked in code)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Ready for Vercel/any Node.js hosting

## Project Structure

```
├── app/
│   ├── (storefront)/          # Public store routes
│   │   └── [storeSlug]/
│   │       ├── page.tsx       # Store homepage
│   │       ├── products/      # Product listings
│   │       ├── product/       # Single product page
│   │       ├── cart/          # Shopping cart
│   │       └── checkout/      # Checkout process
│   ├── (dashboard)/            # Admin dashboard routes
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard overview
│   │       ├── products/      # Product management
│   │       ├── orders/        # Order management
│   │       └── settings/       # Store settings
│   ├── api/                   # API routes
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── storefront/            # Storefront-specific components
│   └── dashboard/             # Dashboard-specific components
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── stores.ts              # Store helper functions
│   ├── products.ts            # Product helper functions
│   ├── orders.ts              # Order helper functions
│   ├── auth.ts                # Auth helpers (placeholder)
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── config/
    └── templates.ts           # Store template configurations
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or remote)
- Environment variables configured

### Installation

1. **Clone the repository** (or use this codebase)

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bizcraft?schema=public"
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations (creates database schema)
   npm run db:migrate

   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Seed initial data** (optional):
   You can manually create a user and store via Prisma Studio:
   ```bash
   npm run db:studio
   ```
   Or create them programmatically in your seed script.

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The Prisma schema includes:

- **User**: Store owners/admins
- **Store**: Individual stores with unique slugs
- **StoreSettings**: Payment and configuration settings per store
- **Product**: Products belonging to stores
- **Order**: Customer orders

See `prisma/schema.prisma` for full details.

## Main Routes

### Public Routes

- `/` - Landing page
- `/login` - Login page (placeholder auth)
- `/[storeSlug]` - Store homepage
- `/[storeSlug]/products` - Product listings
- `/[storeSlug]/product/[productId]` - Single product page
- `/[storeSlug]/cart` - Shopping cart
- `/[storeSlug]/checkout` - Checkout page

### Dashboard Routes (Protected)

- `/dashboard` - Dashboard overview
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/settings` - Store settings

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database (dev)
- `npm run db:studio` - Open Prisma Studio

### Code Style

- TypeScript strict mode enabled
- ESLint with Next.js config
- Prettier recommended (add if needed)

## Authentication

**Current Status**: ✅ **Production-ready Supabase Auth integration**

The app uses **Supabase Auth** for authentication:

- **Sign up** at `/signup` - Create a new account with email and password
- **Login** at `/login` - Sign in with your credentials
- **Logout** - Available in the dashboard header
- **Session Management** - Handled automatically by Supabase via secure cookies
- **Password Security** - Passwords are hashed and stored securely by Supabase

### How It Works

1. **User Identity**: Supabase `auth.users` table is the source of truth
2. **Prisma Sync**: When a user signs up/logs in, a corresponding `User` row is created in Prisma (if it doesn't exist)
3. **User.id Matching**: Prisma `User.id` matches Supabase `auth.users.id` (UUID)
4. **Session**: Supabase manages sessions via secure HTTP-only cookies
5. **Dashboard Protection**: All `/dashboard` routes require authentication

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgresql://..." # Your Supabase Postgres connection string
```

### Key Files

- `lib/supabase/server.ts` - Server-side Supabase client for Server Components/Actions
- `lib/supabase/client.ts` - Client-side Supabase client for Client Components
- `lib/auth.ts` - Auth helpers (`getCurrentUser()`, `getActiveStore()`, `signInWithSupabase()`, etc.)
- `app/login/page.tsx` - Login page with Supabase Auth
- `app/signup/page.tsx` - Signup page with Supabase Auth

### Notes

- The `password` field in Prisma `User` model is no longer used (kept for backward compatibility)
- Supabase handles all password hashing and validation
- Email confirmation can be enabled in Supabase dashboard settings

## Payment Integration

**Current Status**: Structure ready, integration pending

Payment gateway integration points are marked with TODOs:
- Checkout page (`app/(storefront)/[storeSlug]/checkout/page.tsx`)
- Order creation API (`app/api/orders/route.ts`)
- Store settings form (`components/dashboard/StoreSettingsForm.tsx`)

**Supported Providers** (to be integrated):
- Tranzila
- Cardcom
- Others (extensible)

## AI Integration Points

The codebase is structured to easily add AI-powered features. TODOs are marked where AI will be integrated:

1. **Product Creation** (`components/dashboard/NewProductDialog.tsx`):
   - Auto-generate product descriptions
   - Generate SEO titles and meta descriptions
   - Suggest categories

2. **Store Content** (`app/page.tsx`):
   - AI-generated marketing content
   - Store descriptions

3. **Product Optimization**:
   - SEO optimization
   - Content enhancement

Search for `TODO:` comments in the codebase to find all AI integration points.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure

Make sure to:
- Set `DATABASE_URL` environment variable
- Run `npm run db:migrate` after deployment (or use migration hooks)
- Build command: `npm run build`
- Start command: `npm start`

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (Supabase Postgres)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Optional (for future features):**
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `PAYMENT_PROVIDER_API_KEY` - Payment gateway keys
- `AI_API_KEY` - For AI features (when implemented)

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure code compiles: `npm run build`
4. Run linter: `npm run lint`
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.

---

**Note**: This is a scaffolded codebase. Authentication, payment integration, and AI features are placeholders with clear TODOs for future implementation.
