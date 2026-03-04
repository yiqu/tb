import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
} & ComponentProps<'div'>;

export default function ColumnStack({ children, className, ...props }: Props) {
  return (
    <div className={ cn('flex flex-col', className) } { ...props }>
      { children }
    </div>
  );
}
