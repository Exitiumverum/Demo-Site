import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { signUpWithSupabase } from "@/lib/auth";

async function handleSignup(formData: FormData) {
  "use server";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  
  if (!email || !password || !confirmPassword) {
    redirect("/signup?error=missing");
    return;
  }

  if (password !== confirmPassword) {
    redirect("/signup?error=mismatch");
    return;
  }

  if (password.length < 6) {
    redirect("/signup?error=weak");
    return;
  }

  const { user, error } = await signUpWithSupabase(email, password);
  
  if (error || !user) {
    // Check for specific Supabase errors
    const errorMessage = error?.message || "An error occurred";
    if (errorMessage.includes("already registered")) {
      redirect("/signup?error=exists");
    } else {
      redirect("/signup?error=invalid");
    }
    return;
  }

  // Success - redirect to dashboard
  // Note: If email confirmation is required in Supabase, user might need to verify email first
  redirect("/dashboard");
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Sign up to start managing your online store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
            <SignupErrorDisplay searchParams={searchParams} />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            <Link href="/" className="underline">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function SignupErrorDisplay({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  if (!params.error) {
    return null;
  }

  const errorMessages: Record<string, string> = {
    missing: "Please fill in all fields",
    mismatch: "Passwords do not match",
    weak: "Password must be at least 6 characters",
    exists: "An account with this email already exists",
    invalid: "Failed to create account. Please try again.",
  };

  const errorMessage = errorMessages[params.error] || "An error occurred. Please try again.";

  return (
    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      {errorMessage}
    </div>
  );
}
