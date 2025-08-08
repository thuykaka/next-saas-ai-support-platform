import { use } from 'react';
import { WidgetView } from '@/modules/widget/ui/views/widget-view';

interface PageProps {
  searchParams: Promise<{
    orgId: string;
  }>;
}

export default function Page({ searchParams }: PageProps) {
  const { orgId } = use(searchParams);

  return <WidgetView orgId={orgId} />;
}
