import { getActiveStore } from "@/lib/auth";
import { getOrdersByStore } from "@/lib/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export default async function OrdersPage() {
  const store = await getActiveStore();

  if (!store) {
    return <div>Store not found</div>;
  }

  const orders = await getOrdersByStore(store.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items as unknown as CartItem[];
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Customer:</span> {order.customerName}
                    </div>
                    {order.customerEmail && (
                      <div>
                        <span className="font-semibold">Email:</span> {order.customerEmail}
                      </div>
                    )}
                    {order.customerPhone && (
                      <div>
                        <span className="font-semibold">Phone:</span> {order.customerPhone}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Items:</span> {items.length} item(s)
                    </div>
                    <div>
                      <span className="font-semibold">Total:</span> {formatPrice(order.totalPrice)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

