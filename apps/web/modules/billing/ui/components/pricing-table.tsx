'use client';

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const PricingTable = () => {
  const { theme } = useTheme();

  return (
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <ClerkPricingTable
        forOrganizations
        appearance={{
          theme: theme === 'dark' ? dark : undefined,
          elements: {
            pricingTableCard: 'shadow-none! border! rounded-lg!',
            pricingTableCardHeader: 'bg-muted!',
            pricingTableCardBody: 'bg-muted!',
            pricingTableCardFooter: 'bg-muted!',
            pricingTableCardFeatures: 'bg-muted!'
          }
        }}
      />
    </div>
  );
};
