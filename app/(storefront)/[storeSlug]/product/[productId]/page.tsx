"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product, CartItem } from "@/lib/types";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const addToCart = () => {
    if (!product) return;
    
    const cartItem: CartItem = {
      productId: product.id,
      quantity,
      priceAtPurchase: product.price,
      title: product.title,
      imageUrl: product.imageUrl || undefined,
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem(`cart_${storeSlug}`);
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product already in cart
    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
    router.push(`/${storeSlug}/cart`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.title}</CardTitle>
            <CardDescription className="text-lg">
              {formatPrice(product.price)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            {product.category && (
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
            )}

            {product.stock > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-semibold">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock || 999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border rounded-md"
              />
            </div>

            <Button
              onClick={addToCart}
              className="w-full"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

