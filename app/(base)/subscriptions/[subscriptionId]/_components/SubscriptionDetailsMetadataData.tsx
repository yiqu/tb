import Image from 'next/image';
import { DateTime } from 'luxon';
import { Suspense } from 'react';
import startCase from 'lodash/startCase';
import { Tag, Repeat, Pencil, FileText, Calendar, DollarSign } from 'lucide-react';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import DateDisplay from '@/shared/table/DateDisplay';
import Typography from '@/components/typography/Typography';
import { getFrequencyImageUrl } from '@/shared/table/table.utils';
import DateDialogContentBase from '@/shared/dialogs/DateDialogBase';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import KeyValueDisplay from '@/components/key-value/KeyValueDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsMetadataData({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-4">
      <KeyValueDisplay label="Name" value={ subscription.name } icon={ <Tag className="size-5" /> } />
      <KeyValueDisplay
        label="Frequency"
        description="The frequency of bills for this subscription."
        value={
          <div className="flex flex-row items-center justify-start gap-x-2">
            <Image
              src={ getFrequencyImageUrl(subscription.billCycleDuration) }
              alt="Frequency"
              width={ 22 }
              height={ 22 }
              className={ `opacity-90` }
            />
            <Typography variant="labelvalue1" className="font-semibold">
              { startCase(subscription.billCycleDuration) }
            </Typography>
          </div>
        }
        icon={ <Repeat className="size-5" /> }
      />
      <KeyValueDisplay
        label="Default cost"
        description="The cost to use when creating a new bill for this subscription."
        value={ usdFormatter.format(subscription.cost) }
        icon={ <DollarSign className="size-5" /> }
      />
      <KeyValueDisplay label="Description" value={ subscription.description || 'N/A' } icon={ <FileText className="size-5" /> } />
      <KeyValueDisplay
        label="Last updated"
        value={
          <Popover>
            <PopoverTrigger asChild>
              <div
                title={ `${DateTime.fromJSDate(new Date(subscription.updatedAt as unknown as string))
                  .setZone(EST_TIME_ZONE)
                  .toLocaleString(DateTime.DATETIME_MED)}` }
                className={ `
                  light-dashed-underline flex cursor-pointer flex-row items-center justify-start gap-x-1 truncate rounded-md border
                  border-transparent p-1 select-none
                  hover:border-border hover:bg-accent
                ` }
              >
                <DateDisplay date={ subscription.updatedAt } dateFormat="MM/dd/yy" clientLoadingClassName="h-[20px] w-[153px]" />
                <DateRelativeDisplay
                  time={ subscription.updatedAt }
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
                <DateDialogContentBase dateString={ `${subscription.updatedAt}` } isIso />
              </Suspense>
            </PopoverContent>
          </Popover>
        }
        icon={ <Pencil className="size-5" /> }
      />
      <KeyValueDisplay
        label="Created"
        value={
          <Popover>
            <PopoverTrigger asChild>
              <div
                title={ `${DateTime.fromJSDate(new Date(subscription.dateAdded as unknown as string))
                  .setZone(EST_TIME_ZONE)
                  .toLocaleString(DateTime.DATETIME_MED)}` }
                className={ `
                  light-dashed-underline flex cursor-pointer flex-row items-center justify-start gap-x-1 truncate rounded-md border
                  border-transparent p-1 select-none
                  hover:border-border hover:bg-accent
                ` }
              >
                <DateDisplay date={ subscription.dateAdded } dateFormat="MM/dd/yy" clientLoadingClassName="h-[20px] w-[153px]" />
                <DateRelativeDisplay
                  time={ subscription.dateAdded }
                  includeParenthesis
                  clientLoadingClassName="h-[20px] w-[40px]"
                  isCompleted
                  largest={ 2 }
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="min-w-96">
              <Suspense>
                <DateDialogContentBase dateString={ `${subscription.dateAdded}` } isIso />
              </Suspense>
            </PopoverContent>
          </Popover>
        }
        icon={ <Calendar className="size-5" /> }
      />
    </div>
  );
}
