/* eslint-disable readable-tailwind/multiline */
'use client';

import { cn } from '@/lib/utils';
import { appName } from '@/constants/constants';
import { luckiestGuyFont } from '@/lib/fonts-config';
import useSideBarState from '@/hooks/useSideBarState';

export default function NavHeaderText() {
  const { isSidebarCollapsed } = useSideBarState();

  return (
    <div className="relative h-8 w-full overflow-hidden">
      <span
        className={ cn(
          `logo-text-color absolute top-1/2 left-0 -translate-y-1/2 text-2xl font-normal whitespace-nowrap transition-all duration-300 ease-out will-change-transform`,
          luckiestGuyFont.className,
          isSidebarCollapsed ? 'invisible translate-x-8 opacity-0' : `visible translate-x-0 opacity-100`,
        ) }
      >
        { appName }
      </span>
    </div>
  );
}
