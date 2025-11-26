import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreBySlug } from "@/lib/stores";
import { getProductsByStore } from "@/lib/products";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  const products = await getProductsByStore(store.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products available yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
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
                {product.stock > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.stock} in stock
                  </p>
                )}
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
  );
}

