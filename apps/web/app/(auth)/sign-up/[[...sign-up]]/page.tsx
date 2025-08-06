'use client';

import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          cardBox: 'rounded-lg! border! shadow-none!'
        }
      }}
    />
  );
}
