import { create } from 'zustand';
import { WIDGET_SCREENS, WidgetScreen } from '../types';

type ScreenStore = {
  screen: WidgetScreen;
  error: string | null;
  loadingMessage: string | null;
  orgId: string | null;
  actions: {
    setScreen: (screen: WidgetScreen) => void;
    setError: (error: string) => void;
    setLoadingMessage: (message: string) => void;
    setOrgId: (orgId: string) => void;
  };
};

const useScreenStore = create<ScreenStore>()((set) => ({
  screen: WIDGET_SCREENS.LOADING,
  error: null,
  loadingMessage: null,
  orgId: null,
  actions: {
    setScreen: (screen: WidgetScreen) => set({ screen }),
    setError: (error: string) => set({ error }),
    setLoadingMessage: (message: string) => set({ loadingMessage: message }),
    setOrgId: (orgId: string) => set({ orgId })
  }
}));

export const useScreen = () => useScreenStore((state) => state.screen);

export const useScreenError = () => useScreenStore((state) => state.error);

export const useScreenLoadingMessage = () =>
  useScreenStore((state) => state.loadingMessage);

export const useScreenOrgId = () => useScreenStore((state) => state.orgId);

export const useScreenActions = () => useScreenStore((state) => state.actions);
