'use client';

import { useMemo } from 'react';

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
  const idPrefix = isDialogMode ? 'dialog-content' : 'content';
  const ids = useMemo(() => items.map((item) => `${idPrefix}-${item.id}`), [items, idPrefix]);
  const inViewId = useCurrentInViewSmart({ ids, containerId: scrollableContentId });

  return (
    <div className="flex w-full">
      <aside
        className={ cn('sticky top-0 h-screen w-86 shrink-0 overflow-y-auto border-r', {
          'top-[146px]': isDialogMode,
        }) }
      >
        <ContentNavigation items={ items } inViewIds={ inViewId ? [inViewId] : [] } idPrefix={ idPrefix } />
      </aside>
      <ContentMainContent items={ items } idPrefix={ idPrefix } />
    </div>
  );
}
