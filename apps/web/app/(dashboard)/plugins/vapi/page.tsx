import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
import { VapiView } from '@/modules/plugins/ui/views/vapi-view';
import { VapiViewSkeleton } from '@/modules/plugins/ui/views/vapi-view-skeleton';

export default function VapiPage() {
  return (
    <Protect
      condition={(has) => has({ plan: 'pro' })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiViewSkeleton />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
}
