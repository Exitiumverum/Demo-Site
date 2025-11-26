import { db } from "./db";
import { getSupabaseServerClient } from "./supabase/server";
import type { User } from "./types";

/**
 * Get the current authenticated user
 * 
 * This function:
 * 1. Gets the Supabase auth user from the session (via cookies)
 * 2. If no Supabase user exists, returns null
 * 3. If Supabase user exists, finds or creates a corresponding Prisma User row
 * 
 * The Prisma User.id should match Supabase auth.users.id (UUID)
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();
  
  // Get the authenticated user from Supabase session
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    return null;
  }

  // Find or create the corresponding Prisma User row
  let prismaUser = await db.user.findUnique({
    where: { id: supabaseUser.id },
  });

  if (!prismaUser) {
    // Create Prisma User row if it doesn't exist
    // Password field is not used anymore (Supabase handles auth)
    prismaUser = await db.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        password: "", // Not used - Supabase Auth handles passwords
      },
    });
  }

  return prismaUser;
}

/**
 * Get the active store for the current authenticated user
 * 
 * Returns the first store owned by the logged-in user.
 * In the future, this can be extended to support multiple stores per user.
 */
export async function getActiveStore() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Return the first store owned by this user
  return await db.store.findFirst({
    where: { ownerId: user.id },
    include: {
      settings: true,
    },
  });
}

/**
 * Sign in with Supabase Auth
 * 
 * This replaces the old plain-text password comparison.
 * Supabase handles password hashing and validation.
 */
export async function signInWithSupabase(email: string, password: string) {
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error };
  }

  // After successful sign-in, ensure Prisma User row exists
  if (data.user) {
    await getCurrentUser(); // This will create Prisma User if needed
  }

  return { user: data.user, error: null };
}

/**
 * Sign up with Supabase Auth
 */
export async function signUpWithSupabase(email: string, password: string) {
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { user: null, error };
  }

  // After successful sign-up, ensure Prisma User row exists
  if (data.user) {
    await getCurrentUser(); // This will create Prisma User if needed
  }

  return { user: data.user, error: null };
}

/**
 * Sign out from Supabase Auth
 */
export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}
