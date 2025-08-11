import { cn } from '@workspace/ui/lib/utils';
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from 'lucide-react';

interface ConversationStatusIconProps {
  status: 'unresolved' | 'escalated' | 'resolved';
  className?: string;
}

const statusMap = {
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: 'bg-destructive'
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: 'bg-yellow-500'
  },
  resolved: {
    icon: CheckIcon,
    bgColor: 'bg-[#3fb62f]'
  }
} as const;

export const ConversationStatusIcon = ({
  status,
  className
}: ConversationStatusIconProps) => {
  const { icon: Icon, bgColor } = statusMap[status];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full p-1.5',
        bgColor,
        className
      )}
    >
      <Icon className='stroke-3 size-3 text-white' />
    </div>
  );
};
