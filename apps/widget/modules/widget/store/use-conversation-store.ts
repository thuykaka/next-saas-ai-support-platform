import { Id } from '@workspace/backend/_generated/dataModel';
import { create } from 'zustand';

type ConversationStore = {
  id: Id<'conversations'> | null;
  actions: {
    setConversationId: (id: Id<'conversations'> | null) => void;
  };
};

const useConversationStore = create<ConversationStore>((set) => ({
  id: null,
  actions: {
    setConversationId: (id: Id<'conversations'> | null) => set({ id })
  }
}));

export const useConversationId = () =>
  useConversationStore((state) => state.id);

export const useConversationActions = () =>
  useConversationStore((state) => state.actions);
