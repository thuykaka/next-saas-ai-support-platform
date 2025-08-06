import { ConvexReactClient } from 'convex/react';

let convexClient: ConvexReactClient | null = null;

export function getConvexClient(): ConvexReactClient {
  if (!convexClient) {
    convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }
  return convexClient;
}
