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
      <BreadcrumbSegments />
      <Suspense fallback={ <Skeleton className="h-4 w-4 rounded-full" /> }>
        <BreadcrumbCopyUrl />
      </Suspense>
    </BreadcrumbsList>
  );
}
