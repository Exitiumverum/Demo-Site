import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoreBySlug } from "@/lib/stores";
import { Button } from "@/components/ui/button";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {store.logoUrl && (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="h-10 w-10 object-contain"
              />
            )}
            <Link href={`/${storeSlug}`}>
              <h1 className="text-2xl font-bold">{store.name}</h1>
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href={`/${storeSlug}/products`}>
              <Button variant="ghost">Products</Button>
            </Link>
            <Link href={`/${storeSlug}/cart`}>
              <Button variant="outline">Cart</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Store Content */}
      <main>{children}</main>

      {/* Store Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">{store.name}</h3>
              {store.address && <p className="text-sm text-muted-foreground">{store.address}</p>}
              {store.phone && <p className="text-sm text-muted-foreground">{store.phone}</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href={`/${storeSlug}/products`} className="text-muted-foreground hover:underline">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Powered by BizCraft</h3>
              <p className="text-sm text-muted-foreground">
                Create your own online store
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

