import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchWithKbar from './search-with-kbar';

export const AppHeader = () => {
  return (
    <header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
      </div>

      <div className='flex items-center gap-2 px-4 text-sm'>
        <SearchWithKbar />
        <ThemeToggle />
      </div>
    </header>
  );
};
