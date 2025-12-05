import Link from 'next/link';

import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByYear } from '@/models/bills/bills.model';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';

interface Props {
  currentYearData: BillDueWithSubscriptionByYear;
  selectedMonthYear: string | undefined;
}

export default async function CurrentYearContentTextSection({ currentYearData }: Props) {
  const isBillsCountSingle = currentYearData.totalBillsCount === 1;
  const isSubscriptionsCountSingle = currentYearData.totalSubscriptionsCount === 1;

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <Typography className="">
        There { isBillsCountSingle ? 'is' : 'are' } <span className="font-semibold tabular-nums">{ currentYearData.totalBillsCount }</span> bill
        { isBillsCountSingle ? '' : 's' } out of <span className="font-semibold tabular-nums">{ currentYearData.totalSubscriptionsCount }</span>{ ' ' }
        subscription{ isSubscriptionsCountSingle ? '' : 's' } in{ ' ' }
        <Link href={ `/bills?year=${currentYearData.yearParams}` } prefetch>
          year { currentYearData.yearParams }
        </Link>
        .
      </Typography>
      <div className={ `
        flex flex-wrap space-x-1
        *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
      ` }>
        { currentYearData.uniqueBySubscription
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
    </div>
  );
}
