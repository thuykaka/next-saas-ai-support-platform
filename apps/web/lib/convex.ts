import { ConvexReactClient } from 'convex/react';

let convexClient: ConvexReactClient | null = null;

export function getConvexClient(): ConvexReactClient {
  if (!convexClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        'Environment variable NEXT_PUBLIC_CONVEX_URL must be defined'
      );
    }
    convexClient = new ConvexReactClient(url);
  }
  return convexClient;
}
