import { StoreOnboardingForm } from "@/components/dashboard/store-onboarding-form";

export default async function StoreOnboardingPage() {
  // Auth and store checks are handled in onboarding/layout.tsx
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">BizCraft</h1>
        </div>
      </header>

      {/* Onboarding content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome to BizCraft!</h2>
            <p className="text-muted-foreground">
              Let&apos;s set up your first store to get started.
            </p>
          </div>
          <StoreOnboardingForm />
        </div>
      </main>
    </div>
  );
}

