'use client';

import { SignUp } from '@clerk/nextjs';

export const SignUpView = () => {
  return (
    <SignUp
      routing='hash'
      appearance={{
        elements: {
          cardBox: 'rounded-lg! border! shadow-none!'
        }
      }}
    />
  );
};
