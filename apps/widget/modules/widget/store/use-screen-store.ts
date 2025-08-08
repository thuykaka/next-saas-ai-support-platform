import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WIDGET_SCREENS, WidgetScreen } from '../types';

type ScreenStore = {
  screen: WidgetScreen;
  actions: {
    setScreen: (screen: WidgetScreen) => void;
  };
};

const useScreenStore = create<ScreenStore>()(
  persist(
    (set) => ({
      screen: WIDGET_SCREENS.AUTH,
      actions: {
        setScreen: (screen: WidgetScreen) => set({ screen })
      }
    }),
    { name: 'widget-screen-store', partialize: ({ actions, ...rest }) => rest }
  )
);

export const useScreen = () => useScreenStore((state) => state.screen);

export const useScreenActions = () => useScreenStore((state) => state.actions);
