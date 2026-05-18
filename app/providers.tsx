"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Missing Clerk Publishable Key</h2>
        <p>Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your GitHub Secrets and re-run the deployment.</p>
      </div>
    );
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark }} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
