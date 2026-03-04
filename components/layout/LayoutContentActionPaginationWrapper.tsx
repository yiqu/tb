import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';
import { getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

export default async function LayoutContentActionPaginationWrapper({ children }: { children: ReactNode }) {
  const compactMode = await getSettingsApplicationCompactMode();
  return (
    <ColumnStack
      id="content-action-and-pagination-wrapper"
      className={ cn('w-full gap-y-3', {
        'gap-y-1': compactMode,
      }) }
    >
      { children }
    </ColumnStack>
  );
}
