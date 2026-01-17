'use client';

import Link, { LinkProps } from 'next/link';

import { cn } from '@/lib/utils';

/**
 * This prevents the focus event that could trigger a hover card for example. Without this, it will close and then open hover card again.
 * @param children - The children to render
 * @param props - The props to pass to the link
 * @returns
 */
export default function LinkClientOld({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & LinkProps<any>) {
  return (
    <Link prefetch={ true } className={ cn('inline-block', className) } onPointerDown={ (e) => e.preventDefault() } { ...props }>
      { children }
    </Link>
  );
}
