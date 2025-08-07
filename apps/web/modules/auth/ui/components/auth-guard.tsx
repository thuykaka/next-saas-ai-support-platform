'use client';

import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { AuthLayout } from '../layout/auth-layout';
import { SignInView } from '../views/sign-in-view';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>Loading...</AuthLayout>
      </AuthLoading>

      <Authenticated>{children}</Authenticated>

      <Unauthenticated>
        <SignInView />
      </Unauthenticated>
    </>
  );
};
