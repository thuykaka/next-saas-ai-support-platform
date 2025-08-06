'use client';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          cardBox: 'rounded-lg! border! shadow-none!'
        }
      }}
    />
  );
}
