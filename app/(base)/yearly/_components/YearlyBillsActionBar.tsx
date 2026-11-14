import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import LayoutContentActionBarWrapper from '@/components/layout/LayoutContentActionBarWrapper';

import YearlyBillsYearSelectWrapper from './YearlyBillsYearSelectWrapper';

interface YearlyBillsActionBarProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default function YearlyBillsActionBar({ searchParamsPromise }: YearlyBillsActionBarProps) {
  return (
    <LayoutContentActionBarWrapper>
      <Suspense fallback={ <Skeleton className="h-9 w-[160px]" /> }>
        <YearlyBillsYearSelectWrapper searchParamsPromise={ searchParamsPromise } />
      </Suspense>
    </LayoutContentActionBarWrapper>
  );
}
