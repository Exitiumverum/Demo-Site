import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreBySlug } from "@/lib/stores";
import { getFeaturedProducts } from "@/lib/products";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  const featuredProducts = await getFeaturedProducts(store.id, 6);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt={store.name}
            className="h-24 w-24 mx-auto mb-4 object-contain"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">Welcome to {store.name}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our amazing products and start shopping today!
        </p>
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        {featuredProducts.length === 0 ? (
          <p className="text-muted-foreground">No products available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id}>
                {product.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/${storeSlug}/product/${product.id}`} className="w-full">
                    <Button className="w-full">View Product</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {featuredProducts.length > 0 && (
        <div className="text-center mt-12">
          <Link href={`/${storeSlug}/products`}>
            <Button size="lg">View All Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

