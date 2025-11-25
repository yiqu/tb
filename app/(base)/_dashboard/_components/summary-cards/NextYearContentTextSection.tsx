import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByYear } from '@/models/bills/bills.model';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { getAllBillsByYearFromParamsCached } from '@/server/bills/bills.server';

const usdFormatter = getUSDFormatter();

interface Props {
  selectedMonthYear: string | undefined;
}

export default async function NextYearContentTextSection({ selectedMonthYear }: Props) {
  const nextYearData: BillDueWithSubscriptionByYear = await getAllBillsByYearFromParamsCached(selectedMonthYear, 1);
  const isBillsCountSingle = nextYearData.totalBillsCount === 1;
  const isSubscriptionsCountSingle = nextYearData.totalSubscriptionsCount === 1;
  const totalCost = nextYearData.totalBillsCost;

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <Typography className="">
        Next year ({ nextYearData.yearParams }): there { isBillsCountSingle ? 'will be' : 'will be' }{ ' ' }
        <span className="font-semibold tabular-nums">{ nextYearData.totalBillsCount }</span> bill
        { isBillsCountSingle ? '' : 's' } out of <span className="font-semibold tabular-nums">{ nextYearData.totalSubscriptionsCount }</span>{ ' ' }
        subscription
        { isSubscriptionsCountSingle ? '' : 's' }.
      </Typography>
      <div className={ `
        flex flex-wrap space-x-1
        *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
      ` }>
        { nextYearData.uniqueBySubscription
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
      <div>
        <Typography className="tabular-nums">Cost: { usdFormatter.format(totalCost) }</Typography>
      </div>
    </div>
  );
}
