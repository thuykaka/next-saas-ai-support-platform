'use client';

import * as React from 'react';
import { Toaster } from '@workspace/ui/components/sonner';
import { getConvexClient } from '@/lib/convex';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = React.useMemo(() => getConvexClient(), []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <Toaster richColors />
        {children}
      </ThemeProvider>
    </ConvexProviderWithClerk>
  );
}
