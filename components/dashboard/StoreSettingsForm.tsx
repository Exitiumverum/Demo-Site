"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Store } from "@/lib/types";

interface StoreSettingsFormProps {
  store: Store & {
    settings: {
      paymentProvider: string | null;
      paymentPublicKey: string | null;
      paymentSecretKey: string | null;
      paymentRedirectUrl: string | null;
    } | null;
  };
}

export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name,
    slug: store.slug,
    phone: store.phone || "",
    address: store.address || "",
    logoUrl: store.logoUrl || "",
    paymentProvider: store.settings?.paymentProvider || "none",
    paymentPublicKey: store.settings?.paymentPublicKey || "",
    paymentSecretKey: store.settings?.paymentSecretKey || "",
    paymentRedirectUrl: store.settings?.paymentRedirectUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/stores/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: store.id,
          ...formData,
        }),
      });

      if (response.ok) {
        router.refresh();
        alert("Settings updated successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Settings update error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your store&apos;s basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Store Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
            />
            <p className="text-sm text-muted-foreground">
              Your store will be accessible at /{formData.slug}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Configure payment provider integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentProvider">Payment Provider</Label>
            <Select
              value={formData.paymentProvider}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentProvider: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="tranzila">Tranzila</SelectItem>
                <SelectItem value="cardcom">Cardcom</SelectItem>
              </SelectContent>
            </Select>
            {/* TODO: Integrate payment gateway APIs here */}
          </div>
          {formData.paymentProvider !== "none" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentPublicKey">Public Key</Label>
                <Input
                  id="paymentPublicKey"
                  value={formData.paymentPublicKey}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentPublicKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentSecretKey">Secret Key</Label>
                <Input
                  id="paymentSecretKey"
                  type="password"
                  value={formData.paymentSecretKey}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentSecretKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentRedirectUrl">Redirect URL</Label>
                <Input
                  id="paymentRedirectUrl"
                  type="url"
                  value={formData.paymentRedirectUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentRedirectUrl: e.target.value })
                  }
                  placeholder="https://yourstore.com/payment/callback"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}

