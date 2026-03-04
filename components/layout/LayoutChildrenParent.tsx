import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

import { Separator } from '../ui/separator';

export default async function LayoutChildrenParent({ children, className }: { children: ReactNode; className?: string }) {
  const compactMode = await getSettingsApplicationCompactMode();
  return (
    <>
      { compactMode ? null : <Separator /> }
      <div
        className={ cn(
          'my-6',
          {
            'mt-0': compactMode,
          },
          className,
        ) }
        id="layout-children-parent"
      >
        { children }
      </div>
    </>
  );
}
