'use client';

import { useMemo } from 'react';

import useCurrentInView from '@/hooks/useCurrentInView';

import ContentNavigation from './ContentNavigation';
import ContentMainContent from './ContentMainContent';

type Props = {
  className?: string;
  items: { id: number; name: string }[];
}

export default function ContentParent({ className, items }: Props) {
  const ids = useMemo(() => items.map((item) => `content-${item.id}`), [items]);
  const inViewIds = useCurrentInView({ ids });

  return (
    <div className="flex w-full">
      <aside className="sticky top-0 h-screen w-86 shrink-0 overflow-y-auto border-r">
        <ContentNavigation items={ items } inViewIds={ inViewIds } />
      </aside>
      <ContentMainContent items={ items } />
    </div>
  );
}