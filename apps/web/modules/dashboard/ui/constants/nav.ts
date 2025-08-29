import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  MicIcon,
  PaletteIcon,
  type LucideIcon
} from 'lucide-react';

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export const customerSupportNavItems: NavItem[] = [
  {
    title: 'Conversations',
    url: '/conversations',
    icon: InboxIcon
  },
  {
    title: 'Knowledge Base',
    url: '/files',
    icon: LibraryBigIcon
  }
];

export const configurationNavItems: NavItem[] = [
  {
    title: 'Widget Customization',
    url: '/customization',
    icon: PaletteIcon
  },
  {
    title: 'Integrations',
    url: '/integrations',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Voice Assistant',
    url: '/plugins/vapi',
    icon: MicIcon
  }
];

export const accountNavItems: NavItem[] = [
  {
    title: 'Plan & Billing',
    url: '/billing',
    icon: CreditCardIcon
  }
];
