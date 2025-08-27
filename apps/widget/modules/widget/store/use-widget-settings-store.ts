import { Doc } from '@workspace/backend/_generated/dataModel';
import { create } from 'zustand';

type WidgetSettingsStore = {
  settings: Doc<'widgetSettings'> | null;
  actions: {
    setSettings: (settings: Doc<'widgetSettings'> | null) => void;
  };
};

const useWidgetSettingsStore = create<WidgetSettingsStore>((set) => ({
  settings: null,
  actions: {
    setSettings: (settings: Doc<'widgetSettings'> | null) => set({ settings })
  }
}));

export const useWidgetSettings = () =>
  useWidgetSettingsStore((state) => state.settings);
export const useWidgetSettingsActions = () =>
  useWidgetSettingsStore((state) => state.actions);
