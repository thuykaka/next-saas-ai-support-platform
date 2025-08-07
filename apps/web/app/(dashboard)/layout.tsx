import { AuthGuard } from '@/modules/auth/ui/components/auth-guard';
import { OrganizationGuard } from '@/modules/auth/ui/components/organization-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {/* Need both guards to ensure user is logged in and has an organization (same case middleware not working) */}
      <OrganizationGuard>{children}</OrganizationGuard>
    </AuthGuard>
  );
}
