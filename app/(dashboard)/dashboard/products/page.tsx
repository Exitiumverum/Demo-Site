import Link from "next/link";
import { getActiveStore } from "@/lib/auth";
import { getProductsByStore } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { NewProductDialog } from "@/components/dashboard/NewProductDialog";

export default async function ProductsPage() {
  const store = await getActiveStore();

  if (!store) {
    return <div>Store not found</div>;
  }

  const products = await getProductsByStore(store.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <NewProductDialog storeId={store.id} />
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No products yet.</p>
            <NewProductDialog storeId={store.id} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 flex-1">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                        {product.category && (
                          <span className="text-muted-foreground">
                            Category: {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

