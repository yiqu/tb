'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useScrollHide } from '@/hooks/useScrollHide';

type HideAnimation = 'fade' | 'slideUp';

interface ContentStickyByScrollWrapperProps {
  children: ReactNode;
  threshold?: number;
  containerId?: string;
  className?: string;
  stickyClassName?: string;
  hideAnimation?: HideAnimation;
}

export default function ContentStickyByScrollWrapper({
  children,
  threshold = 50,
  containerId,
  className,
  stickyClassName = 'top-12',
  hideAnimation = 'fade',
}: ContentStickyByScrollWrapperProps) {
  const { scrolledUpOrWithinThreshold, isAtTop, isAreaScrollable } = useScrollHide(threshold, containerId);

  const isFade = hideAnimation === 'fade';

  return (
    <div
      className={ cn(
        'sticky z-50 w-full bg-background duration-300',
        isFade ? 'transition-opacity ease-out' : 'transition-all ease-in-out',
        stickyClassName,
        scrolledUpOrWithinThreshold ?
          cn('opacity-100', !isFade && 'translate-y-0')
        : cn('pointer-events-none opacity-0', !isFade && '-translate-y-full'),
        className,
        {
          'shadow-[0_4px_4px_-3px_rgba(0,0,0,0.08)]': !isAtTop && isAreaScrollable && scrolledUpOrWithinThreshold,
        },
      ) }
    >
      { children }
    </div>
  );
}
