'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { Calendar, CircleAlert } from 'lucide-react';
import { useWatch, useFormContext } from 'react-hook-form';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { billAddableSchema } from '@/validators/bills/bill.schema';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import HFDatepickerDialog from '@/components/hook-form/HFDatepickerDialog';

export default function AddBillDueDate() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();
  const dueDate = useWatch({ control, name: 'dueDate' });
  const isDueInFuture: boolean = !!(dueDate && Number.parseInt(dueDate) > DateTime.now().setZone(EST_TIME_ZONE).toMillis());

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <HFDatepickerDialog
        name="dueDate"
        label="Due Date"
        control={ control }
        buttonClassName="w-[50%] truncate justify-start"
        formItemClassName="flex w-full"
        timeZone={ EST_TIME_ZONE }
        useEpochTimestamp={ true }
        buttonDisplayFormat="PPP (P hh:mm a)"
        showTime={ true }
        isEpochTimeStampInString={ true }
      />
      { dueDate ?
        <div className="flex flex-row items-center justify-start gap-x-2">
          { isDueInFuture ?
            <Calendar className="size-4" />
          : <CircleAlert className="size-4 text-yellow-600" /> }
          <DateRelativeDisplay
            time={ dueDate }
            addSuffix={ false }
            postFixText={ isDueInFuture ? '' : 'past due!' }
            prefixText={ isDueInFuture ? 'Due in' : '' }
            clientLoadingClassName="w-[10rem]"
          />
        </div>
      : null }
    </div>
  );
}
