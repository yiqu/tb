import z from 'zod';
import { Suspense } from 'react';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import CardLoading from './summary-cards/CardLoading';
import TotalDueYearCard from './summary-cards/TotalDueYearCard';
import NextMonthDueCard from './summary-cards/NextMonthDueCard';
import TotalDueMonthCard from './summary-cards/TotalDueMonthCard';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function SummarySectionCards({ searchParamsPromise }: Props) {
  return (
    <div
      className={ `
        grid w-full grid-cols-1 gap-4
        *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs
        sec:grid-cols-2
        two:grid-cols-3
        main:grid-cols-3
        dark:*:data-[slot=card]:bg-card
      ` }
    >
      <Suspense fallback={ <CardLoading cardTitle="Month" /> }>
        <TotalDueMonthCard searchParamsPromise={ searchParamsPromise } />
      </Suspense>
      <Suspense fallback={ <CardLoading cardTitle="Next Month" /> }>
        <NextMonthDueCard searchParamsPromise={ searchParamsPromise } />
      </Suspense>
      <Suspense fallback={ <CardLoading cardTitle="Year" /> }>
        <TotalDueYearCard searchParamsPromise={ searchParamsPromise } />
      </Suspense>
    </div>
  );
}
