import { DateTime } from 'luxon';
import { AlarmClock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

import DateDisplay from './DateDisplay';

export default function SearchTableCellDisplayDueDateDateDisplay({ date, billDue }: { date: string; billDue: BillDueWithSubscription }) {
  let isDueDateInCurrentMonth = false;

  if (billDue.subscription.billCycleDuration === 'monthly') {
    const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
    const currentMonth = currentDateLuxon.month;
    const dueDateLuxon = DateTime.fromMillis(Number.parseInt(date)).setZone(EST_TIME_ZONE);
    const dueDateMonth = dueDateLuxon.month;
    isDueDateInCurrentMonth = dueDateMonth === currentMonth;
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
  const isPaidOrReimbursed: boolean = !isPaidAndReimbursed && (!!billDue.paid || !!billDue.reimbursed);

  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <DateDisplay date={ date } dateFormat="MM/dd/yy" />
      { isDueDateInCurrentMonth ?
        <AlarmClock
          className={ cn('size-6 text-red-600', {
            'text-green-700': isPaidAndReimbursed,
            'text-yellow-700': isPaidOrReimbursed,
          }) }
        />
      : null }
    </div>
  );
}
