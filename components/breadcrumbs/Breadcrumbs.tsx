import { Suspense } from 'react';

import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import HomeSegment from './HomeSegment';
import BreadcrumbsList from './BreadcrumbsList';
import BreadcrumbCopyUrl from './BreadcrumbCopyUrl';
import BreadcrumbSegments from './BreadcrumbSegments';

export default function Breadcrumbs() {
  return (
    <BreadcrumbsList>
      <HomeSegment />
      <BreadcrumbSeparator />
      <BreadcrumbSegments />
      <Suspense>
        <BreadcrumbCopyUrl />
      </Suspense>
    </BreadcrumbsList>
  );
}
