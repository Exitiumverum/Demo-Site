import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getActiveStore, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

async function handleLogout() {
  "use server";
  await signOut();
  redirect("/login");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication - redirect to login if not authenticated
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Get the active store for this user
  const store = await getActiveStore();

  // If no store, redirect to onboarding (now at /onboarding, not /dashboard/onboarding)
  if (!store) {
    redirect("/onboarding");
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">BizCraft Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{store.name}</span>
            <form action={handleLogout}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
