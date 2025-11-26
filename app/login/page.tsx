import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { signInWithSupabase } from "@/lib/auth";

async function handleLogin(formData: FormData) {
  "use server";
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    redirect("/login?error=missing");
    return;
  }

  const { user, error } = await signInWithSupabase(email, password);
  
  if (error || !user) {
    redirect("/login?error=invalid");
    return;
  }

  // Success - Supabase has set the session cookie
  redirect("/dashboard");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to BizCraft</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              placeholder="Enter your password"
              required
            />
            <LoginErrorDisplay searchParams={searchParams} />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
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

async function LoginErrorDisplay({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  if (!params.error) {
    return null;
  }

  const errorMessage =
    params.error === "missing"
      ? "Please fill in all fields"
      : params.error === "invalid"
      ? "Invalid email or password"
      : "An error occurred. Please try again.";

  return (
    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      {errorMessage}
    </div>
  );
}
