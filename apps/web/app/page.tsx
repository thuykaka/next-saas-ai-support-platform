import { add } from '@workspace/math/add';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';

export default function Page() {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Apps/Web</h1>
        <Button size='sm'>Button</Button>

        <p>{add(1, 2)}</p>

        <Input />

        <Checkbox />
      </div>
    </div>
  );
}
