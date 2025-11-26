"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;
  
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(`cart_${storeSlug}`);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [storeSlug]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link href={`/${storeSlug}/products`}>
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">
                      {formatPrice(item.priceAtPurchase)} each
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <label htmlFor={`qty-${item.productId}`} className="text-sm">
                        Quantity:
                      </label>
                      <input
                        id={`qty-${item.productId}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, parseInt(e.target.value) || 1)
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Link href={`/${storeSlug}/checkout`} className="w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

