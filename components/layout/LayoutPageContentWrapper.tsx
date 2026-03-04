import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import ColumnStack from '@/shared/components/ColumnStack';
import { getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

type Props = {
  children: ReactNode;
  className?: string;
} & React.ComponentProps<'div'>;

export default async function LayoutPageContentWrapper({ children, className, ...props }: Props) {
  const compactMode = await getSettingsApplicationCompactMode();
  return (
    <ColumnStack
      className={ cn('w-full gap-y-3', className, {
        'gap-y-2': compactMode,
      }) }
      id="layout-page-content-wrapper"
      { ...props }
    >
      { children }
    </ColumnStack>
  );
}
