/* eslint-disable better-tailwindcss/multiline */
'use client';

import { cn } from '@/lib/utils';
import { appName } from '@/constants/constants';
import useSideBarState from '@/hooks/useSideBarState';
import RandomLetterSwapPingPong from '@/fancy/components/text/random-letter-swap-pingpong-anim';

export default function NavHeaderText() {
  const { isSidebarCollapsed } = useSideBarState();

  return (
    <div className="relative h-8 w-full truncate">
      <div
        className={ cn(
          `logo-text-color absolute top-1/2 left-0 w-full -translate-y-1/2 truncate font-fun text-[25px] transition-all duration-300 ease-out will-change-transform`,
          isSidebarCollapsed ? 'invisible translate-x-8 opacity-0' : `visible translate-x-0 opacity-100`,
        ) }
      >
        <RandomLetterSwapPingPong label={ appName ?? 'Reimbursement' } reverse={ false } />
      </div>
    </div>
  );
}
