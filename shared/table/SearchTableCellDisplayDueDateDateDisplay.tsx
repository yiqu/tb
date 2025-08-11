import { DateTime } from 'luxon';
import { AlarmClock, CircleAlert, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

import DateDisplay from './DateDisplay';

export default function SearchTableCellDisplayDueDateDateDisplay({ date, billDue }: { date: string; billDue: BillDueWithSubscription }) {
  let isDueDateInCurrentMonth = false;
  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentDateEpoch = currentDateLuxon.toMillis();

  if (billDue.subscription.billCycleDuration === 'monthly') {
    const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
    const currentMonth = currentDateLuxon.month;
    const currentYear = currentDateLuxon.year;
    const dueDateLuxon = DateTime.fromMillis(Number.parseInt(date)).setZone(EST_TIME_ZONE);
    const dueDateMonth = dueDateLuxon.month;
    const dueDateYear = dueDateLuxon.year;
    isDueDateInCurrentMonth = dueDateMonth === currentMonth && dueDateYear === currentYear;
  } else if (billDue.subscription.billCycleDuration === 'yearly') {
    const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
    const currentYear = currentDateLuxon.year;
    const dueDateLuxon = DateTime.fromMillis(Number.parseInt(date)).setZone(EST_TIME_ZONE);
    const dueDateYear = dueDateLuxon.year;
    isDueDateInCurrentMonth = dueDateYear === currentYear;
  } else if (billDue.subscription.billCycleDuration === 'once') {
    isDueDateInCurrentMonth = true;
  }

  const isPaidAndReimbursed: boolean = !!billDue.paid && !!billDue.reimbursed;
  //const isPaidOrReimbursed: boolean = !isPaidAndReimbursed && (!!billDue.paid || !!billDue.reimbursed);
  const isPastDueDate: boolean = Number.parseInt(date) < currentDateEpoch;
  const isPastAndNotPaidOrReimbursed: boolean = isPastDueDate && (!billDue.paid || !billDue.reimbursed);

  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <DateDisplay date={ date } dateFormat="MM/dd/yy" />
      { isDueDateInCurrentMonth && !isPaidAndReimbursed ?
        <span title={ `Due this month, not paid and not reimbursed` }>
          <AlarmClock className={ cn('size-6 text-red-500') } />
        </span>
      : null }
      { isDueDateInCurrentMonth && isPaidAndReimbursed ?
        <span title={ `Due this month, paid and reimbursed` }>
          <CircleCheck className={ cn('size-6 text-green-500') } />
        </span>
      : null }
      { !(isDueDateInCurrentMonth && !isPaidAndReimbursed) && isPastAndNotPaidOrReimbursed ?
        <div className="flex flex-row items-center justify-start gap-x-2" title={ `Past due, not paid or reimbursed` }>
          <CircleAlert className="size-6 text-yellow-500" />
        </div>
      : null }
    </div>
  );
}
