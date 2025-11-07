import { ReactNode } from 'react';

export default function ContentActionBarStickyWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={ `sticky top-12 z-50 flex w-full flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2 bg-background py-2` }>
      { children }
    </div>
  );
}
