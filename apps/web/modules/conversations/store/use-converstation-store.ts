import { Doc } from '@workspace/backend/_generated/dataModel';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ConversationStore = {
  conversationStatusFilter: Doc<'conversations'>['status'] | 'all';
  actions: {
    setConversationStatusFilter: (
      status: Doc<'conversations'>['status'] | 'all'
    ) => void;
  };
};

const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      conversationStatusFilter: 'all',
      actions: {
        setConversationStatusFilter: (status) =>
          set({ conversationStatusFilter: status })
      }
    }),
    { name: 'conversation-store', partialize: ({ actions, ...rest }) => rest }
  )
);

export const useConversationActions = () =>
  useConversationStore((state) => state.actions);

export const useConversationStatusFilter = () =>
  useConversationStore((state) => state.conversationStatusFilter);
