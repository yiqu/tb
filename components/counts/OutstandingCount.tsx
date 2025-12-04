import { HTMLAttributes } from 'react';

import { getOutstandingBillsCountForMonthAndYearCached } from '@/server/bills/bills.server';

interface Props {
  selectedMonthYear: string | undefined;
  showTooltip?: boolean;
}

export default async function OutstandingCount({ selectedMonthYear, showTooltip, ...props }: Props & HTMLAttributes<HTMLSpanElement>) {
  const outstandingCount = await getOutstandingBillsCountForMonthAndYearCached(selectedMonthYear);

  if (outstandingCount === 0) {
    return null;
  }

  if (showTooltip) {
    return (
      <span title="Not paid or not reimbursed bills" { ...props }>
        { outstandingCount }
      </span>
    );
  }

  return <>{ outstandingCount }</>;
}
