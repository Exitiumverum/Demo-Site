import { getActiveStore } from "@/lib/auth";
import { getProductsByStore } from "@/lib/products";
import { getOrdersByStore } from "@/lib/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const store = await getActiveStore();

  if (!store) {
    return <div>Store not found</div>;
  }

  const products = await getProductsByStore(store.id);
  const orders = await getOrdersByStore(store.id);
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in your store
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              Orders received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{(totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store Info */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Store Name:</span> {store.name}
            </div>
            <div>
              <span className="font-semibold">Store Slug:</span> {store.slug}
            </div>
            <div>
              <span className="font-semibold">Store URL:</span>{" "}
              <a
                href={`/${store.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                /{store.slug}
              </a>
            </div>
            {store.phone && (
              <div>
                <span className="font-semibold">Phone:</span> {store.phone}
              </div>
            )}
            {store.address && (
              <div>
                <span className="font-semibold">Address:</span> {store.address}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

