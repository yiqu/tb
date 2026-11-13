import Image from 'next/image';
import { DateTime } from 'luxon';
import { ReactNode, Suspense } from 'react';
import startCase from 'lodash/startCase';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import DateDisplay from '@/shared/table/DateDisplay';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { getFrequencyImageUrl } from '@/shared/table/table.utils';
import DateDialogContentBase from '@/shared/dialogs/DateDialogBase';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/custom/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsMetadataData({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div
      className={ `
        grid w-full grid-cols-2 gap-x-6 gap-y-4
        @3xl:grid-cols-3
        @6xl:grid-cols-[minmax(0,2fr)_auto_auto_auto_auto_minmax(0,3fr)]
      ` }
    >
      <Field label="Name">
        <div className="flex min-w-0 flex-row items-center justify-start gap-x-2">
          <SubscriptionLogo subscriptionName={ subscription.name } height={ 20 } className="shrink-0" />
          <Typography variant="labelvalue1" className="min-w-0 truncate font-semibold" title={ subscription.name }>
            { subscription.name }
          </Typography>
        </div>
      </Field>
      <Field label="Frequency" title="The frequency of bills for this subscription.">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <Image
            src={ getFrequencyImageUrl(subscription.billCycleDuration) }
            alt="Frequency"
            width={ 20 }
            height={ 20 }
            className="opacity-90"
          />
          <Typography variant="labelvalue1" className="font-semibold">
            { startCase(subscription.billCycleDuration) }
          </Typography>
        </div>
      </Field>
      <Field label="Default cost" title="The cost to use when creating a new bill for this subscription.">
        <Typography variant="labelvalue1" className="font-semibold tabular-nums">
          { usdFormatter.format(subscription.cost) }
        </Typography>
      </Field>
      <Field label="Created">
        <DatePopover date={ subscription.dateAdded } />
      </Field>
      <Field label="Last updated">
        <DatePopover date={ subscription.updatedAt } />
      </Field>
      <Field label="Description" className="col-span-2 @3xl:col-span-1">
        <Typography variant="labelvalue1" className="wrap-break-word">
          { subscription.description || 'N/A' }
        </Typography>
      </Field>
    </div>
  );
}

function Field({ label, title, className, children }: { label: string; title?: string; className?: string; children: ReactNode }) {
  return (
    <ColumnStack className={ `min-w-0 gap-y-1 ${className ?? ''}` } title={ title }>
      <Typography variant="label0" className="font-semibold uppercase">
        { label }
      </Typography>
      <div className="flex min-h-7 flex-row items-center">{ children }</div>
    </ColumnStack>
  );
}

function DatePopover({ date }: { date: Date | null }) {
  if (!date) {
    return <Typography variant="labelvalue1">N/A</Typography>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          title={ `${DateTime.fromJSDate(new Date(date as unknown as string))
            .setZone(EST_TIME_ZONE)
            .toLocaleString(DateTime.DATETIME_MED)}` }
          className={ `
            light-dashed-underline -ml-1 flex cursor-pointer flex-row items-center justify-start gap-x-1 truncate rounded-md border
            border-transparent px-1 select-none
            hover:border-border hover:bg-accent
          ` }
        >
          <DateDisplay date={ date } dateFormat="MM/dd/yy" clientLoadingClassName="h-[20px] w-[60px]" />
          <DateRelativeDisplay
            time={ date }
            includeParenthesis
            clientLoadingClassName="h-[20px] w-[40px]"
            showClientLoading={ true }
            largest={ 2 }
            isCompleted
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="min-w-96">
        <Suspense>
          <DateDialogContentBase dateString={ `${date}` } isIso />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
}
