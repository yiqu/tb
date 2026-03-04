import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';

export default function LayoutContentActionBarWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RowStack className={ cn('flex-wrap items-center justify-start gap-x-2 gap-y-2', className) } id="layout-content-action-bar-wrapper">
      { children }
    </RowStack>
  );
}
