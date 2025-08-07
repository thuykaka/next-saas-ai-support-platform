'use client';

import { SignIn } from '@clerk/nextjs';

export const SignInView = () => {
  return (
    <SignIn
      routing='hash'
      appearance={{
        elements: {
          cardBox: 'rounded-lg! border! shadow-none!'
        }
      }}
    />
  );
};
