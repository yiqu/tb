'use client';

import Link, { LinkProps } from 'next/link';
import { RouteType } from 'next/dist/lib/load-custom-routes';

/**
 * This prevents the focus event that could trigger a hover card for example. Without this, it will close and then open hover card again.
 * @param children - The children to render
 * @param props - The props to pass to the link
 * @returns
 */
export default function LinkClient({ children, ...props }: { children: React.ReactNode } & LinkProps<RouteType>) {
  return (
    <Link prefetch={ true } className="inline-block" onPointerDown={ (e) => e.preventDefault() } { ...props }>
      { children }
    </Link>
  );
}
