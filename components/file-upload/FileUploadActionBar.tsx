import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';

/** The row below the drop zone that holds the actions of the current phase, e.g. the Upload button. */
export default function FileUploadActionBar({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <RowStack className={ cn('w-full items-center justify-end gap-x-2', className) } { ...props }>
      { children }
    </RowStack>
  );
}
