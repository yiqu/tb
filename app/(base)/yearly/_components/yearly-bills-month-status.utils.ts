import { YearlyBillsMonth } from '@/models/bills/yearly-bills.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export const YEARLY_BILLS_MONTH_STATUS = {
  complete: 'complete',
  incomplete: 'incomplete',
  none: 'none',
} as const;

export type YearlyBillsMonthStatus = (typeof YEARLY_BILLS_MONTH_STATUS)[keyof typeof YEARLY_BILLS_MONTH_STATUS];

// Status shown next to a month's name: only for the current and past months that have bills.
export function getYearlyBillsMonthStatus(month: YearlyBillsMonth, isFutureMonth: boolean): YearlyBillsMonthStatus {
  if (isFutureMonth || month.billDues.length === 0) {
    return YEARLY_BILLS_MONTH_STATUS.none;
  }

  const isAllSettled: boolean = month.billDues.every((billDue: BillDueWithSubscription) => {
    return billDue.paid && billDue.reimbursed;
  });

  return isAllSettled ? YEARLY_BILLS_MONTH_STATUS.complete : YEARLY_BILLS_MONTH_STATUS.incomplete;
}
