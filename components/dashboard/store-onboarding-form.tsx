"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FormValues = {
  name: string;
  slug?: string;
  phone?: string;
  address?: string;
};

export function StoreOnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    slug: "",
    phone: "",
    address: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Store name is required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/stores/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            slug: formData.slug?.trim() || undefined,
            phone: formData.phone?.trim() || undefined,
            address: formData.address?.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Failed to create store");
          return;
        }

        // Success - full page redirect to ensure dashboard layout picks up the new store
        window.location.href = "/dashboard";
      } catch (err) {
        console.error("Store creation error:", err);
        setError("An error occurred. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your First Store</CardTitle>
        <CardDescription>
          Set up your store to start selling. You can always update these details later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="My Awesome Store"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Store Slug (optional)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="my-awesome-store"
            />
            <p className="text-xs text-muted-foreground">
              Your store will be accessible at /[slug]. If left empty, it will be auto-generated from the store name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+972-50-123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="City, Street, Number"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating Store..." : "Create Store"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

