import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
import { FilesView } from '@/modules/files/ui/views/files-view';
import { FilesViewSkeleton } from '@/modules/files/ui/views/files-view-skeleton';

export default function FilesPage() {
  return (
    // The plan key get from clerk dashboard
    <Protect
      condition={(has) => has({ plan: 'pro' })}
      fallback={
        <PremiumFeatureOverlay>
          <FilesViewSkeleton />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
}
