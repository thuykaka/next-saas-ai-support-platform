'use client';

import { toast } from 'sonner';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';

export const UserListView = () => {
  const users = useQuery(api.users.getMany);
  const createUser = useMutation(api.users.create);

  const handleCreateUser = async () => {
    const { id } = await createUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password'
    });
    toast.success(`User created with id: ${id}`);
  };

  return (
    <div>
      <h1>Apps/Widget</h1>
      <Button onClick={handleCreateUser} className='mb-2'>
        Create User
      </Button>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};
