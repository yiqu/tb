import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function LayoutParent({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={ cn('my-3 flex flex-col', className) }>{ children }</section>;
}
