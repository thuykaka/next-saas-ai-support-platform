import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted';
  onLoadMore: (numItems: number) => void;
  loadSize?: number;
  observerEnabled?: boolean;
}

export const useInfiniteScroll = ({
  status,
  onLoadMore,
  loadSize = 10,
  observerEnabled = true
}: UseInfiniteScrollProps) => {
  const topEleRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (status === 'CanLoadMore') {
      onLoadMore(loadSize);
    }
  }, [status, onLoadMore, loadSize]);

  useEffect(() => {
    const topEle = topEleRef.current;
    if (!(topEle && observerEnabled)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(topEle);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, observerEnabled]);

  return {
    topEleRef,
    handleLoadMore,
    canLoadMore: status === 'CanLoadMore',
    isLoadingMore: status === 'LoadingMore',
    isLoadingFirstPage: status === 'LoadingFirstPage',
    isExhausted: status === 'Exhausted'
  };
};
