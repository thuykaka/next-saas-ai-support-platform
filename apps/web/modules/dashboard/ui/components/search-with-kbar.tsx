'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useKBar } from 'kbar';
import { SearchIcon } from 'lucide-react';

interface Props {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export default function SearchWithKbar({
  className = '',
  placeholder = 'Search'
}: Props) {
  const { query } = useKBar();
  return (
    <Button
      variant='outline'
      className={cn(
        'bg-muted/25 text-muted-foreground hover:bg-muted/50 relative h-8 w-64 flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:pr-12 md:flex-none',
        className
      )}
      onClick={() => query.toggle()}
    >
      <SearchIcon
        aria-hidden='true'
        className='absolute left-1.5 top-1/2 -translate-y-1/2'
      />
      <span className='ml-4'>{placeholder}</span>
      <kbd className='bg-muted pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  );
}
