# Quick Setup Guide

## Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```env
   # Database (Supabase Postgres)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
   
   # Supabase Auth (Required)
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

   **Getting Supabase credentials:**
   - Go to your Supabase project dashboard
   - Settings → API → Copy Project URL and anon/public key
   - Settings → Database → Copy connection string

3. **Initialize database**:
   ```bash
   npm run db:generate
   ```
   
   **Note**: If you haven't created the schema yet, run the SQL from `supabase-schema.sql` in Supabase SQL Editor, or use:
   ```bash
   npm run db:push
   ```
   (Note: `db:push` may not work with connection poolers - use SQL Editor if needed)

4. **Run dev server**:
   ```bash
   npm run dev
   ```

## Testing the Application

1. **Landing Page**: Visit `http://localhost:3000`
2. **Sign Up**: Visit `http://localhost:3000/signup` - Create a new account
3. **Login**: Visit `http://localhost:3000/login` - Sign in with your account
4. **Dashboard**: Visit `http://localhost:3000/dashboard` (requires authentication)
5. **Storefront**: Visit `http://localhost:3000/[your-store-slug]`

## Authentication Flow

1. **Sign Up**: Create account at `/signup`
   - Supabase creates the auth user
   - A Prisma `User` row is automatically created (matching Supabase user ID)

2. **Login**: Sign in at `/login`
   - Supabase validates credentials
   - Session cookie is set automatically
   - You're redirected to `/dashboard`

3. **Dashboard Access**: 
   - All `/dashboard` routes require authentication
   - If not logged in, you're redirected to `/login`
   - If logged in but no store exists, you'll see a "No Store Found" message

4. **Logout**: Click logout button in dashboard header
   - Clears Supabase session
   - Redirects to `/login`

## Creating Your First Store

After signing up and logging in:

1. You'll need to create a store (this can be done via Prisma Studio or SQL):
   ```sql
   -- Get your user ID from Supabase auth.users table or Prisma User table
   INSERT INTO "Store" (id, "ownerId", name, slug) 
   VALUES ('clx1234567890', 'your-user-id-from-supabase', 'My Store', 'my-store');
   ```

2. Or use Prisma Studio:
   ```bash
   npm run db:studio
   ```
   - Find your User (ID matches Supabase auth user ID)
   - Create a Store with that User's ID as ownerId

## Key Files to Review

- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/auth.ts` - Authentication helpers (Supabase + Prisma)
- `app/login/page.tsx` - Login page
- `app/signup/page.tsx` - Signup page
- `app/(dashboard)/dashboard/layout.tsx` - Dashboard protection
- `prisma/schema.prisma` - Database schema
- `lib/stores.ts` - Store operations
- `lib/products.ts` - Product operations
- `lib/orders.ts` - Order operations

## Important Notes

- **User IDs**: Prisma `User.id` must match Supabase `auth.users.id` (UUID format)
- **Password Field**: The `password` field in Prisma `User` model is no longer used (Supabase handles passwords)
- **Session Management**: Supabase manages sessions via secure cookies - no manual cookie handling needed
- **Email Confirmation**: Can be enabled in Supabase Dashboard → Authentication → Email Templates

## Next Steps

1. ✅ **Authentication**: Complete - Using Supabase Auth
2. **Store Creation Flow**: Add UI for creating stores after signup
3. **Add Payment Gateway**: Integrate Tranzila/Cardcom in checkout flow
4. **Add AI Features**: Implement AI generation in product creation
5. **Add Image Upload**: Replace URL-based images with file uploads
6. **Add Email Notifications**: Send order confirmations

## Common Issues

**Database connection error**: 
- Make sure PostgreSQL is running and DATABASE_URL is correct
- If using connection pooler, ensure you're using the correct connection string format

**Supabase auth not working**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Check Supabase project is active (not paused)

**Prisma client not found**: 
- Run `npm run db:generate`

**Store not found after login**:
- Create a Store in the database with your User ID as ownerId
- Use Prisma Studio or SQL to create the store

**User ID mismatch**:
- Ensure Prisma User.id matches Supabase auth.users.id (UUID format)
- The system auto-creates Prisma User on first login if it doesn't exist
