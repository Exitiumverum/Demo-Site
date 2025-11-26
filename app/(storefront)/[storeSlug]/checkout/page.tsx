"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  useEffect(() => {
    const storedCart = localStorage.getItem(`cart_${storeSlug}`);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      router.push(`/${storeSlug}/cart`);
    }
  }, [storeSlug, router]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Integrate payment gateway here (e.g., Tranzila, Cardcom)
      // For now, we'll just create the order directly
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || null,
          customerPhone: formData.customerPhone || null,
          items: cart,
          totalPrice,
        }),
      });

      if (response.ok) {
        // Clear cart
        localStorage.removeItem(`cart_${storeSlug}`);
        // Redirect to success page or order confirmation
        router.push(`/${storeSlug}/order-success`);
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  {/* TODO: Integrate payment gateway (Tranzila, Cardcom, etc.) */}
                  Payment processing will be integrated here. For now, this is a demo order.
                </p>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : `Place Order - ${formatPrice(totalPrice)}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.priceAtPurchase)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.priceAtPurchase * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

