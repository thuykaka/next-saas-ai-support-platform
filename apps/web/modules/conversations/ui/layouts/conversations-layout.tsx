import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@workspace/ui/components/resizable';
import { ConversationsSidebar } from '@/modules/conversations/ui/components/conversations-sidebar';

export const ConversationsLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div className='px-4'>
          <h2 className='text-xl font-bold tracking-tight'>Conversations</h2>
          <p className='text-muted-foreground text-sm'>
            Manage your conversations
          </p>
        </div>
      </div>
      <ResizablePanelGroup direction='horizontal' className='h-full flex-1'>
        <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
          <ConversationsSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className='h-full'>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
