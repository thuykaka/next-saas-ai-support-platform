import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
import { VapiView } from '@/modules/plugins/ui/views/vapi-view';

export default function VapiPage() {
  return (
    <Protect
      condition={(has) => has({ plan: 'pro' })}
      fallback={
        <PremiumFeatureOverlay>
          <VapiView />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </Protect>
  );
}
