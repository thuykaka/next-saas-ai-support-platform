'use client';

import * as React from 'react';
import { getConvexClient } from '@/lib/convex';
import { ConvexProvider } from 'convex/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = React.useMemo(() => getConvexClient(), []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
