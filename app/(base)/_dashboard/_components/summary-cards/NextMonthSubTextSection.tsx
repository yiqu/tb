import z from 'zod';

import { getUSDFormatter } from '@/lib/number.utils';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { getAllBillsByMonthAndYearCached } from '@/server/bills/bills.server';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CurrentMonthDateData, BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';

import { getNextMonthLuxon } from '../dashboard.utils';

const usdFormatter = getUSDFormatter();

interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  monthData: CurrentMonthDateData;
}

export default async function NextMonthSubTextSection({ currentMonthData, searchParamsPromise, monthData }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  let monthToFetch = monthData.nextMonth;
  let yearToFetch = monthData.nextMonthYear;

  if (searchParams.selectedMonthYear) {
    const [month, year] = searchParams.selectedMonthYear.split('/');
    const nextMonthLuxon = getNextMonthLuxon(Number.parseInt(month), Number.parseInt(year));
    monthToFetch = nextMonthLuxon.month;
    yearToFetch = nextMonthLuxon.year;
  }

  const nextMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    monthToFetch.toString(),
    yearToFetch.toString(),
  );

  const isMonthSameAsNextMonth: boolean = currentMonthData.totalBillsCost === nextMonthData.totalBillsCost;
  const isThisMonthMoreThanNextMonth = currentMonthData.totalBillsCost > nextMonthData.totalBillsCost;
  const monthDifference: number = Math.abs(currentMonthData.totalBillsCost - nextMonthData.totalBillsCost);

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-1">
          <Typography className="">Bills:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body2">
            { nextMonthData.totalBillsCount }
          </Typography>
        </div>
        <Separator orientation="vertical" />
        <div className={ `
          flex flex-wrap space-x-1
          *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
        ` }>
          { nextMonthData.billDues
            .toSorted((a, b) => (a.subscription.name.toLowerCase() > b.subscription.name.toLowerCase() ? 1 : -1))
            .map((billdue) => {
              return (
                <div key={ billdue.id }>
                  <SubscriptionLogoAvatar
                    subscription={ billdue.subscription }
                    avatarProps={ {
                      className: 'size-5',
                    } }
                  />
                </div>
              );
            }) }
        </div>
      </div>

      <div>
        { isMonthSameAsNextMonth ?
          <Typography>
            Bills cost will be the <span className="font-semibold">same</span> for next month.
          </Typography>
        : <Typography>
          Bills cost will{ ' ' }
          <span className="font-semibold tabular-nums">
            { isThisMonthMoreThanNextMonth ? 'decrease' : 'increase' } by { usdFormatter.format(monthDifference) }
          </span>{ ' ' }
          for next month.
        </Typography>
        }
      </div>
    </div>
  );
}
