import { redirect } from "next/navigation";
import { getActiveStore } from "@/lib/auth";
import { updateStore, updateStoreSettings } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreSettingsForm } from "@/components/dashboard/StoreSettingsForm";

export default async function SettingsPage() {
  const store = await getActiveStore();

  if (!store) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Store Settings</h1>

      <StoreSettingsForm store={store} />
    </div>
  );
}

