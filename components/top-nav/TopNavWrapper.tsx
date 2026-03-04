'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import useHasScrolled from '@/hooks/has-scrolled';
import { useClientOnly } from '@/hooks/useClientOnly';
import { useAppSetting } from '@/providers/AppSettingProvider';

export default function TopNavWrapper({ children }: { children: ReactNode }) {
  const { hasScrolled } = useHasScrolled();
  const { isCompactMode } = useAppSetting();
  const isClient = useClientOnly();

  if (!isClient) {
    return (
      <header
        className={ cn(
          `
            sticky top-0 z-40 box-border flex h-12 shrink-0 flex-row items-center justify-between gap-2 border-b border-transparent
            bg-background transition-[width,height] ease-linear
            group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
          `,
        ) }
      >
        { children }
      </header>
    );
  }

  return (
    <header
      className={ cn(
        `
          sticky top-0 z-40 box-border flex h-12 shrink-0 flex-row items-center justify-between gap-2 border-b border-transparent
          bg-background transition-[width,height] ease-linear
          group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
        `,
        {
          'border-border': isCompactMode || hasScrolled,
        },
      ) }
    >
      { children }
    </header>
  );
}
