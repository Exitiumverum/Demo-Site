import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
          <CardDescription>
            Thank you for your order. We&apos;ll process it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You will receive a confirmation email shortly with your order details.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/${storeSlug}`}>
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href={`/${storeSlug}/products`}>
              <Button>View Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

