'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';

import RowStack from '@/shared/components/RowStack';

import { BreadcrumbSegmentIcon, BreadcrumbSegmentTitle } from './BreadCrumbsUtils';
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '../ui/breadcrumb';

export default function BreadcrumbSegments() {
  const pathname: string = usePathname();
  const params: Params = useParams();
  const paths: string[] = pathname.split('/').filter(Boolean);

  return (
    <>
      { paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        return (
          <React.Fragment key={ path }>
            { isLast ?
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <RowStack className="items-center gap-x-1">
                    <BreadcrumbSegmentIcon path={ path } params={ params } isLast={ isLast } />
                    <BreadcrumbSegmentTitle path={ path } isLast={ isLast } paths={ paths } />
                  </RowStack>
                </BreadcrumbPage>
              </BreadcrumbItem>
            : <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={ href } prefetch>
                    <RowStack className="items-center gap-x-1">
                      <BreadcrumbSegmentIcon path={ path } params={ params } isLast={ isLast } />
                      <BreadcrumbSegmentTitle path={ path } isLast={ isLast } paths={ paths } />
                    </RowStack>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
            }
          </React.Fragment>
        );
      }) }
    </>
  );
}
