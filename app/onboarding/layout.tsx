import { redirect } from "next/navigation";
import { getCurrentUser, getActiveStore } from "@/lib/auth";

/**
 * Separate layout for onboarding that doesn't require a store
 * This prevents the infinite redirect loop
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication - redirect to login if not authenticated
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // If user already has a store, redirect to dashboard
  const existingStore = await getActiveStore();
  if (existingStore) {
    redirect("/dashboard");
  }

  // Render onboarding page without dashboard layout
  return <>{children}</>;
}

