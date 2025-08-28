'use client';

import { PricingTable as ClerkPricingTable } from '@clerk/nextjs';

export const PricingTable = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <ClerkPricingTable
        forOrganizations
        appearance={{
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
