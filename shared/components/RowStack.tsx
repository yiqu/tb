import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
} & ComponentProps<'div'>;

export default function RowStack({ children, className, ...props }: Props) {
  return (
    <div className={ cn('flex flex-row', className) } { ...props }>
      { children }
    </div>
  );
}
