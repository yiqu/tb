'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import useHasScrolled from '@/hooks/has-scrolled';

export default function TopNavWrapper({ children }: { children: ReactNode }) {
  const { hasScrolled } = useHasScrolled();

  return (
    <header
      className={ cn(
        `
          sticky top-0 z-10 flex h-16 shrink-0 flex-row items-center
          justify-between gap-2 bg-background/95 backdrop-blur
          transition-[width,height] ease-linear
          group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
          supports-[backdrop-filter]:bg-background/60
        `,
        {
          'kq-light-shadow': hasScrolled,
        },
      ) }
    >
      { children }
    </header>
  );
}
