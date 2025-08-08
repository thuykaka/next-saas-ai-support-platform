import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ContactSessionStore = {
  id: string | null;
  actions: {
    setId: (id: string) => void;
  };
};

const useContactSessionStore = create<ContactSessionStore>()(
  persist(
    (set) => ({
      id: null,
      actions: {
        setId: (id: string) => set({ id })
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
