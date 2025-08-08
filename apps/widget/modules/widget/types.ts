export const WIDGET_SCREENS = {
  ERROR: 'error',
  LOADING: 'loading',
  SELECTION: 'selection',
  VOICE: 'voice',
  AUTH: 'auth',
  INBOX: 'inbox',
  CHAT: 'chat',
  CONTACT: 'contact'
} as const;

export type WidgetScreen = (typeof WIDGET_SCREENS)[keyof typeof WIDGET_SCREENS];
