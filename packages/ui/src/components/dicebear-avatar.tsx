'use client';

import { useMemo } from 'react';
import { Avatar, AvatarImage } from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';
import { glass } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

interface DicebearAvatarProps {
  seed: string;
  className?: string;
  size?: number;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
}

export const DicebearAvatar = ({
  seed,
  className,
  size = 32,
  badgeClassName,
  imageUrl,
  badgeImageUrl
}: DicebearAvatarProps) => {
  const avatarUrl = useMemo(() => {
    if (imageUrl) return imageUrl;
    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size
    });
    return avatar.toDataUri();
  }, [seed, size, imageUrl]);

  const badgeSize = Math.round(size * 0.5);

  return (
    <div
      className='relative inline-block'
      style={{ width: size, height: size }}
    >
      <Avatar
        className={cn('border', className)}
        style={{ width: size, height: size }}
      >
        <AvatarImage src={avatarUrl} alt='avatar' />
      </Avatar>
      {badgeImageUrl && (
        <div
          className={cn(
            'border-background bg-background absolute bottom-0 right-0 flex items-center justify-center overflow-hidden rounded-full border-2',
            badgeClassName
          )}
          style={{
            width: badgeSize,
            height: badgeSize,
            transform: 'translate(15%, 15%)'
          }}
        >
          <img
            alt='Badge'
            className='h-full w-full object-cover'
            height={badgeSize}
            width={badgeSize}
            src={badgeImageUrl}
          />
        </div>
      )}
    </div>
  );
};
