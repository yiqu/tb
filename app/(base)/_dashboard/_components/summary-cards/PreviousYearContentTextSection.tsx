import Link from 'next/link';

import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByYear } from '@/models/bills/bills.model';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { getAllBillsByYearFromParamsCached } from '@/server/bills/bills.server';

import DateRangeEpochDisplay from './DateRangeEpochDisplay';

const usdFormatter = getUSDFormatter();

interface Props {
  selectedMonthYear: string | undefined;
}

export default async function PreviousYearContentTextSection({ selectedMonthYear }: Props) {
  const previousYearData: BillDueWithSubscriptionByYear = await getAllBillsByYearFromParamsCached(selectedMonthYear, -1);
  const isBillsCountSingle = previousYearData.totalBillsCount === 1;
  const isSubscriptionsCountSingle = previousYearData.totalSubscriptionsCount === 1;
  const totalCost = previousYearData.totalBillsCost;

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <Typography className="">
        <Link href={ `/bills?year=${previousYearData.yearParams}` } prefetch>
          Previous year ({ previousYearData.yearParams }):
        </Link>{ ' ' }
        there { isBillsCountSingle ? 'was' : 'were' } <span className="font-semibold tabular-nums">{ previousYearData.totalBillsCount }</span>{ ' ' }
        bill
        { isBillsCountSingle ? '' : 's' } out of{ ' ' }
        <span className="font-semibold tabular-nums">{ previousYearData.totalSubscriptionsCount }</span> subscription
        { isSubscriptionsCountSingle ? '' : 's' }.
      </Typography>
      <div className={ `
        flex flex-wrap space-x-1
        *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
      ` }>
        { previousYearData.uniqueBySubscription
          .toSorted((a, b) => (a.subscription.name.toLowerCase() > b.subscription.name.toLowerCase() ? 1 : -1))
          .map((subscription) => {
            return (
              <div key={ subscription.id }>
                <SubscriptionLogoAvatar
                  subscription={ subscription.subscription }
                  avatarProps={ {
                    className: 'size-5',
                  } }
                />
              </div>
            );
          }) }
      </div>
      <DateRangeEpochDisplay startDateEpoch={ previousYearData.startDateEpoch } endDateEpoch={ previousYearData.endDateEpoch }>
        <Typography className="tabular-nums">Cost: { usdFormatter.format(totalCost) }</Typography>
      </DateRangeEpochDisplay>
    </div>
  );
}
