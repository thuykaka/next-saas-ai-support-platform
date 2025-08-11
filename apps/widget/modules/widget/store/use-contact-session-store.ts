import { Id } from '@workspace/backend/_generated/dataModel';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ContactSessionStore = {
  id: Id<'contactSessions'> | null;
  actions: {
    setContactSessionId: (id: Id<'contactSessions'>) => void;
  };
};

const useContactSessionStore = create<ContactSessionStore>()(
  persist(
    (set) => ({
      id: null,
      actions: {
        setContactSessionId: (id: Id<'contactSessions'>) => set({ id })
      }
    }),
    {
      name: 'contact-session',
      partialize: ({ actions, ...rest }) => rest
    }
  )
);

export const useContactSessionId = () =>
  useContactSessionStore((state) => state.id);

export const useContactSessionActions = () =>
  useContactSessionStore((state) => state.actions);
