'use client';

import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

export const UserListViewContent = () => {
  const createUser = useMutation(api.users.create);
  const currentUser = useQuery(api.auth.getCurrentUser);

  const handleCreateUser = async () => {
    const { id } = await createUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    });

    toast.success(`User created with id: ${id}`);
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1>Apps/Web</h1>
      <Button onClick={handleCreateUser} className='mb-2'>
        Create User
      </Button>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </div>
  );
};

export const UserListView = () => {
  return (
    <>
      {/* <UserButton /> */}
      {/* <OrganizationSwitcher hidePersonal={true} /> */}
      <UserListViewContent />
    </>
  );
};
