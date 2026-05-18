"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark }} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
