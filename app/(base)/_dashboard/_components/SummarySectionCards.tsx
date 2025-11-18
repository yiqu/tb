import z from 'zod';
import { Suspense } from 'react';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import CardLoading from './summary-cards/CardLoading';
import TotalDueYearCard from './summary-cards/TotalDueYearCard';
import NextMonthDueCard from './summary-cards/NextMonthDueCard';
import TotalDueMonthCard from './summary-cards/TotalDueMonthCard';
import PreviousMonthDueCard from './summary-cards/PreviousMonthDueCard';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function SummarySectionCards({ searchParamsPromise }: Props) {
  return (
    <div
      className={ `
        grid w-full grid-cols-2 gap-4
        *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs
        sec:grid-cols-2
        two:grid-cols-4
        dark:*:data-[slot=card]:bg-card
      ` }
    >
      <Suspense fallback={ <CardLoading cardTitle="This Month" /> }>
        <TotalDueMonthCard searchParamsPromise={ searchParamsPromise } />
      </Suspense>
      <NextMonthDueCard />
      <PreviousMonthDueCard />
      <TotalDueYearCard />
    </div>
  );
}
