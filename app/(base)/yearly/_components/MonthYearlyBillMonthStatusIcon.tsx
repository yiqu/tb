import { CircleAlert, CircleCheck } from 'lucide-react';

import { YEARLY_BILLS_MONTH_STATUS, YearlyBillsMonthStatus } from './yearly-bills-month-status.utils';

interface MonthYearlyBillMonthStatusIconProps {
  status: YearlyBillsMonthStatus;
}

// Same size as the month image beside it (44px).
export default function MonthYearlyBillMonthStatusIcon({ status }: MonthYearlyBillMonthStatusIconProps) {
  if (status === YEARLY_BILLS_MONTH_STATUS.complete) {
    return <CircleCheck className="size-11 shrink-0 text-green-600 dark:text-green-500" aria-label="All bills paid and reimbursed" role="img" />;
  }

  if (status === YEARLY_BILLS_MONTH_STATUS.incomplete) {
    return <CircleAlert className="size-11 shrink-0 text-yellow-500 dark:text-yellow-400" aria-label="Some bills not paid or reimbursed" role="img" />;
  }

  return null;
}
