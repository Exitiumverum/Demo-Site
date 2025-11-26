import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">BizCraft</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Create your online store in minutes</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          BizCraft is a powerful multi-tenant e-commerce platform that helps you launch
          your online store quickly and easily. Coming soon: AI-powered content generation
          for products and store descriptions.
        </p>
        <Link href="/signup">
          <Button size="lg" className="text-lg px-8">
            Start now
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>
                Each business gets its own store with a unique URL slug
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your store is accessible at <code className="bg-muted px-1 rounded">/[storeSlug]</code>,
                giving you a professional online presence instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                Intuitive dashboard for managing products, orders, and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete control over your store with a clean, modern admin interface.
                Manage inventory, track orders, and configure payment settings all in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Content</CardTitle>
              <CardDescription>
                Coming soon: Automatic product descriptions and SEO optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {/* TODO: Add AI generation logic here */}
                Our AI will help you create compelling product descriptions, optimize
                SEO metadata, and generate marketing content automatically.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ready to get started?</CardTitle>
            <CardDescription>
              Join businesses already using BizCraft to power their online stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button size="lg">Create your store</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BizCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

