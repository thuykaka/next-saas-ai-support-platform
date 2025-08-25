'use client';

import { forwardRef, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const InputPassword = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled =
    props.value === '' || props.value === undefined || props.disabled;

  return (
    <div className='relative'>
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent'
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className='size-4' aria-hidden='true' />
        ) : (
          <EyeOffIcon className='size-4' aria-hidden='true' />
        )}
        <span className='sr-only'>
          {showPassword ? 'Hide password' : 'Show password'}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});
InputPassword.displayName = 'InputPassword';

export { InputPassword };
