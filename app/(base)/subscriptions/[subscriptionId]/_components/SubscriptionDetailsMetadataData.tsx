import Link from 'next/link';
import Image from 'next/image';
import { DateTime } from 'luxon';
import startCase from 'lodash/startCase';
import { ExternalLinkIcon } from 'lucide-react';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import DateDisplay from '@/shared/table/DateDisplay';
import Typography from '@/components/typography/Typography';
import DateDialogContent from '@/shared/dialogs/DateDialog';
import { getFrequencyImageUrl } from '@/shared/table/table.utils';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsMetadataData({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-4">
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Name</Typography>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <Typography variant="labelvalue1" className="font-semibold">
            { subscription.name }
          </Typography>
          { subscription.url ?
            <Link href={ (subscription.url ?? '') as any } target="_blank" rel="noopener noreferrer">
              <div className="flex flex-row items-center justify-start gap-x-1">
                <Typography variant="labelvalue1" className="font-semibold">
                  { subscription.url }
                </Typography>
                <ExternalLinkIcon className="h-4 w-4" />
              </div>
            </Link>
          : null }
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Frequency</Typography>
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
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Default cost</Typography>
        <Typography variant="labelvalue1" className="font-semibold">
          { usdFormatter.format(subscription.cost) }
        </Typography>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Description</Typography>
        <Typography variant={ subscription.description ? 'labelvalue1' : 'nodata1' }>{ subscription.description || 'N/A' }</Typography>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Last updated</Typography>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${DateTime.fromJSDate(new Date(subscription.updatedAt as unknown as string))
                .setZone(EST_TIME_ZONE)
                .toLocaleString(DateTime.DATETIME_MED)}` }
              className={ `
                flex cursor-pointer flex-row items-center justify-start gap-x-1 truncate rounded-md border-1 border-transparent p-1
                select-none
                hover:border-border hover:bg-accent
              ` }
            >
              <DateDisplay date={ subscription.updatedAt } dateFormat="MM/dd/yy" clientLoadingClassName="h-[20px] w-[153px]" />
              <DateRelativeDisplay time={ subscription.updatedAt } includeParenthesis clientLoadingClassName="h-[20px] w-[40px]" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="min-w-96">
            <DateDialogContent dateString={ `${subscription.updatedAt}` } isIso />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col items-start justify-start gap-y-1">
        <Typography variant="label1">Created</Typography>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${DateTime.fromJSDate(new Date(subscription.dateAdded as unknown as string))
                .setZone(EST_TIME_ZONE)
                .toLocaleString(DateTime.DATETIME_MED)}` }
              className={ `
                flex cursor-pointer flex-row items-center justify-start gap-x-1 truncate rounded-md border-1 border-transparent p-1
                select-none
                hover:border-border hover:bg-accent
              ` }
            >
              <DateDisplay date={ subscription.dateAdded } dateFormat="MM/dd/yy" clientLoadingClassName="h-[20px] w-[153px]" />
              <DateRelativeDisplay time={ subscription.dateAdded } includeParenthesis clientLoadingClassName="h-[20px] w-[40px]" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="min-w-96">
            <DateDialogContent dateString={ `${subscription.dateAdded}` } isIso />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
