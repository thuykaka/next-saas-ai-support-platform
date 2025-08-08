'use client';

import { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  accountNavItems,
  configurationNavItems,
  customerSupportNavItems
} from '../constants/nav';

export const AppSidebar = () => {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();

  useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon' className='sidebar-scrollbar group'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <OrganizationSwitcher
                hidePersonal={true}
                skipInvitationScreen={true}
                appearance={{
                  elements: {
                    rootBox: 'w-full! h-12!',
                    avatarBox: 'size-8! rounded-lg!',
                    organizationSwitcherTrigger:
                      'w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                    organizationPreview:
                      'group-data-[collapsible=icon]:justify-center! gap-2!',
                    organizationPreviewTextContainer:
                      'group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!',
                    organizationSwitcherTriggerIcon:
                      'group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!'
                  }
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        {/* Customer Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarMenu>
            {customerSupportNavItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  className={cn(
                    pathname === item.url &&
                      'from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! bg-gradient-to-b'
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className='size-4' />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarMenu>
            {configurationNavItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  className={cn(
                    pathname === item.url &&
                      'from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! bg-gradient-to-b'
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className='size-4' />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            {accountNavItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.url}
                  className={cn(
                    pathname === item.url &&
                      'from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90! bg-gradient-to-b'
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className='size-4' />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: 'w-full! h-12!',
                  userButtonTrigger:
                    'w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
                  userButtonBox:
                    'w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!',
                  userButtonOuterIdentifier:
                    'pl-0! group-data-[collapsible=icon]:hidden! text-sm! font-medium! capitalize!'
                }
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
