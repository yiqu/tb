'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import useIsClient from '@/hooks/useIsClient';

import { Skeleton } from '../ui/skeleton';
import CopyToClipBoard from '../copy-clipboard/CopyToClipboard';

export default function BreadcrumbCopyUrl() {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-4 w-4 rounded-full" />;
  }

  const url = `${window.location.protocol}//${window.location.host}${pathName}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;

  return <CopyToClipBoard text={ url } title="Copy shareable link" className={ `size-6` } />;
}
