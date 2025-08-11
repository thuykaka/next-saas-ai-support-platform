import { ConversationsLayout } from '@/modules/conversations/ui/layouts/conversations-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ConversationsLayout>{children}</ConversationsLayout>;
}
