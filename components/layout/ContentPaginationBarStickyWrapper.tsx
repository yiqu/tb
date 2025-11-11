import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function ContentPaginationBarStickyWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={ cn(`sticky top-[100px] z-20 flex w-full flex-row items-center justify-between bg-background py-2`, className) }>
      { children }
    </div>
  );
}
