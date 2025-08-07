'use client';

import { OrganizationList } from '@clerk/nextjs';

export const OrgSelectView = () => {
  return (
    <OrganizationList
      afterCreateOrganizationUrl={'/'}
      afterSelectOrganizationUrl={'/'}
      hidePersonal={true}
      skipInvitationScreen={true}
    />
  );
};
