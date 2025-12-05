import { HTMLAttributes } from 'react';
import { CircleCheck } from 'lucide-react';

import Typography from '@/components/typography/Typography';
import { getOutstandingBillsCountForMonthAndYearCached } from '@/server/bills/bills.server';

export default async function BillCountDisplayParent({
  selectedMonthYear,
  ...props
}: { selectedMonthYear: string | undefined } & HTMLAttributes<HTMLSpanElement>) {
  const outstandingCount = await getOutstandingBillsCountForMonthAndYearCached(selectedMonthYear);

  if (outstandingCount === 0) {
    return <CircleCheck className={ `
      size-4 text-green-700
      dark:text-green-500
    ` } />;
  }

  return (
    <Typography title="Not paid or not reimbursed bills" { ...props } className={ `
      font-semibold text-red-700 tabular-nums
      dark:text-red-400
    ` }>
      ({ outstandingCount })
    </Typography>
  );
}
