import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function LayoutChildrenParent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={ cn('my-6', className) }>{ children }</div>;
}
