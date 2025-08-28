import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
import { FilesView } from '@/modules/files/ui/views/files-view';

export default function FilesPage() {
  return (
    // The plan key get from clerk dashboard
    <Protect
      condition={(has) => has({ plan: 'pro' })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
}
