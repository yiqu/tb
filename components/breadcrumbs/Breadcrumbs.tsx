import { Suspense } from 'react';

import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import HomeSegment from './HomeSegment';
import { Skeleton } from '../ui/skeleton';
import BreadcrumbsList from './BreadcrumbsList';
import BreadcrumbCopyUrl from './BreadcrumbCopyUrl';
import BreadcrumbSegments from './BreadcrumbSegments';

export default function Breadcrumbs() {
  return (
    <BreadcrumbsList>
      <HomeSegment />
      <BreadcrumbSeparator />
      <Suspense fallback={ <Skeleton className="h-6 w-[45px] rounded-md" /> }>
        <BreadcrumbSegments />
      </Suspense>
      <Suspense fallback={ <Skeleton className="h-4 w-4 rounded-full" /> }>
        <BreadcrumbCopyUrl />
      </Suspense>
    </BreadcrumbsList>
  );
}
