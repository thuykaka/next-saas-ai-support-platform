import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { HomeIcon, InboxIcon } from 'lucide-react';

interface WidgetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const WidgetHeader = ({ children, className }: WidgetHeaderProps) => {
  return (
    <header
      className={cn(
        'from-primary text-primary-foreground bg-gradient-to-b to-[#0b63f3] p-4',
        className
      )}
    >
      {children}
    </header>
  );
};
