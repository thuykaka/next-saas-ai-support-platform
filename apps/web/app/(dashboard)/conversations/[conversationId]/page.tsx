import { Id } from '@workspace/backend/_generated/dataModel';
import { ConversationsDetailView } from '@/modules/conversations/ui/views/conversations-detail-view';

type ConversationDetailPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationDetailPage({
  params
}: ConversationDetailPageProps) {
  const { conversationId } = await params;

  return (
    <ConversationsDetailView
      conversationId={conversationId as Id<'conversations'>}
    />
  );
}
