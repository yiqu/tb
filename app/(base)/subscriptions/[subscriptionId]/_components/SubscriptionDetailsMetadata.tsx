import { DateTime } from 'luxon';

import { CardContent } from '@/components/ui/card';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import DateDisplay from '@/shared/table/DateDisplay';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import DateDialogContent from '@/shared/dialogs/DateDialog';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFrequencyImage from './SubscriptionDetailsMetadataFrequencyImage';

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsMetadata({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <DisplayCard className="w-full">
      <CardContent>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <div className="flex h-full items-center justify-center select-none">
              <SubscriptionDetailsMetadataFrequencyImage frequency={ subscription.billCycleDuration } />
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex w-full flex-col items-start justify-start gap-y-4">
              <div className="flex flex-col items-start justify-start gap-y-1">
                <Typography variant="label1">Name</Typography>
                <Typography variant="labelvalue1" className="font-semibold">
                  { subscription.name }
                </Typography>
              </div>
              <div className="flex flex-col items-start justify-start gap-y-1">
                <Typography variant="label1">Default cost</Typography>
                <Typography variant="labelvalue1" className="font-semibold">
                  { usdFormatter.format(subscription.cost) }
                </Typography>
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
                        font-semibold select-none
                        hover:border-border hover:bg-accent
                      ` }
                    >
                      <DateDisplay date={ subscription.updatedAt } dateFormat="MM/dd/yy" />
                      <DateRelativeDisplay time={ subscription.updatedAt } includeParenthesis />
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
                        font-semibold select-none
                        hover:border-border hover:bg-accent
                      ` }
                    >
                      <DateDisplay date={ subscription.dateAdded } dateFormat="MM/dd/yy" />
                      <DateRelativeDisplay time={ subscription.dateAdded } includeParenthesis />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-96">
                    <DateDialogContent dateString={ `${subscription.dateAdded}` } isIso />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </DisplayCard>
  );
}
