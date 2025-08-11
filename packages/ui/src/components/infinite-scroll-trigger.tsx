import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface InfiniteScrollTriggerProps {
  className?: string;
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  noMoreText?: string;
  loadMoreText?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollTrigger = ({
  className,
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  noMoreText = 'No more items',
  loadMoreText = 'Load more',
  ref
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = 'Loading...';
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn('flex w-full justify-center py-2', className)} ref={ref}>
      <Button
        disabled={!canLoadMore || isLoadingMore}
        onClick={onLoadMore}
        size='sm'
        variant='ghost'
      >
        {text}
      </Button>
    </div>
  );
};
