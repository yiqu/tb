'use client';

import { LinkProps } from 'next/link';

import LinkAnimated from '../components/LinkAnimated';

/**
 * This prevents the focus event that could trigger a hover card for example. Without this, it will close and then open hover card again.
 * @param children - The children to render
 * @param props - The props to pass to the link
 * @returns
 */
export default function LinkClient({ children, ...props }: { children: React.ReactNode } & LinkProps<any>) {
  return (
    <LinkAnimated prefetch={ true } onPointerDown={ (e) => e.preventDefault() } { ...props }>
      { children }
    </LinkAnimated>
  );
}
