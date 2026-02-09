'use client';

import { useMemo, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import useCurrentInViewSmart from '@/hooks/useCurrentInViewSmart';

import ContentNavigation from './ContentNavigation';
import ContentMainContent from './ContentMainContent';

type Props = {
  className?: string;
  items: { id: number; name: string }[];
  scrollableContentId?: string;
  isDialogMode?: boolean;
};

export default function ContentParent({ items, scrollableContentId, isDialogMode }: Props) {
  const [forceSelectId, setForceSelectId] = useState<string | undefined>();
  const idPrefix = isDialogMode ? 'dialog-content' : 'content';
  const ids = useMemo(() => items.map((item) => `${idPrefix}-${item.id}`), [items, idPrefix]);
  const inViewId = useCurrentInViewSmart({ ids, containerId: scrollableContentId, forceSelectId });

  // Clear forceSelectId when user scrolls after a nav click.
  // Short delay skips the programmatic scroll from scrollIntoView.
  useEffect(() => {
    if (!forceSelectId) return;

    const scrollTarget = scrollableContentId ? document.getElementById(scrollableContentId) : window;

    if (!scrollTarget) return;

    let scrollHandler: (() => void) | null = null;

    const timeoutId = setTimeout(() => {
      scrollHandler = () => setForceSelectId(undefined);
      scrollTarget.addEventListener('scroll', scrollHandler, { passive: true, once: true });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scrollHandler) {
        scrollTarget.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [forceSelectId, scrollableContentId]);

  const handleOnNavItemClickAction = (itemId: string) => {
    setForceSelectId(itemId);
  };

  return (
    <div className="flex w-full">
      <aside
        className={ cn('sticky top-0 h-screen w-86 shrink-0 overflow-y-auto border-r', {
          'top-[146px]': isDialogMode,
        }) }
      >
        <ContentNavigation
          items={ items }
          inViewIds={ inViewId ? [inViewId] : [] }
          idPrefix={ idPrefix }
          onNavItemClickAction={ handleOnNavItemClickAction }
        />
      </aside>
      <ContentMainContent items={ items } idPrefix={ idPrefix } />
    </div>
  );
}
