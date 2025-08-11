import {
  SidebarInset,
  SidebarProvider
} from '@workspace/ui/components/sidebar';
import { cookies } from 'next/headers';
import { AuthGuard } from '@/modules/auth/ui/components/auth-guard';
import { OrganizationGuard } from '@/modules/auth/ui/components/organization-guard';
import { AppHeader } from '@/modules/dashboard/ui/components/app-header';
import { AppSidebar } from '@/modules/dashboard/ui/components/app-sidebar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <AuthGuard>
      {/* Need both guards to ensure user is logged in and has an organization (same case middleware not working) */}
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            {/* page main content */}
            <div className='flex flex-1 flex-col px-4'>{children}</div>
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
}
