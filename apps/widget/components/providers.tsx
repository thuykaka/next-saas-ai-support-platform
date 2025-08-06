'use client';

import * as React from 'react';
import { ConvexProvider } from 'convex/react';
import { getConvexClient } from '@/lib/convex';

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = getConvexClient();

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
