'use client';

import * as React from 'react';
import { Toaster } from '@workspace/ui/components/sonner';
import { getConvexClient } from '@/lib/convex';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = React.useMemo(() => getConvexClient(), []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Toaster richColors/>
      {children}
    </ConvexProviderWithClerk>
  );
}
