import { AlarmClock, CircleAlert, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

import Typography from '../typography/Typography';

export default function BillStatusExplain() {
  return (
    // isPaidAndReimbursed: boolean = !!billDue.paid && !!billDue.reimbursed;
    //isDueDateInCurrentMonth && !isPaidAndReimbursed
    <div className="flex flex-col items-start justify-start gap-y-2">
      <div className="flex flex-row items-center justify-start gap-x-2">
        <span title={ `Due this month, paid and reimbursed` }>
          <CircleCheck className={ cn('size-6 text-green-500') } />
        </span>
        <Typography>Completed, paid and reimbursed</Typography>
      </div>

      <div className="flex flex-row items-center justify-start gap-x-2">
        <span title={ `Due this month, not paid and not reimbursed` }>
          <AlarmClock className={ cn('size-6 text-red-500') } />
        </span>
        <Typography>Due this month, not completed.</Typography>
      </div>

      <div className="flex flex-row items-center justify-start gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-2" title={ `Past due, not paid or reimbursed` }>
          <CircleAlert className="size-6 text-yellow-500" />
        </div>
        <Typography>Past due, not completed.</Typography>
      </div>
    </div>
  );
}
