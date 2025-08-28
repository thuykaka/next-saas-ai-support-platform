import { Protect } from '@clerk/nextjs';
import { PremiumFeatureOverlay } from '@/modules/billing/ui/components/premium-feature-overlay';
import { WidgetCustomizationView } from '@/modules/widget-customization/ui/views/widget-customization-view';

export default function CustomizationPage() {
  return (
    <Protect
      condition={(has) => has({ plan: 'pro' })}
      fallback={
        <PremiumFeatureOverlay>
          <WidgetCustomizationView />
        </PremiumFeatureOverlay>
      }
    >
      <WidgetCustomizationView />
    </Protect>
  );
}
