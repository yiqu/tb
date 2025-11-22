import z from 'zod';

import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { getAllBillsByMonthAndYearCached } from '@/server/bills/bills.server';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CurrentMonthDateData, BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';

import { getPreviousMonthLuxon } from '../dashboard.utils';

interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  monthData: CurrentMonthDateData;
}

export default async function CurrentMonthSubTextSection({ currentMonthData, searchParamsPromise, monthData }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  let monthToFetch = monthData.previousMonth;
  let yearToFetch = monthData.previousMonthYear;

  if (searchParams.selectedMonthYear) {
    const [month, year] = searchParams.selectedMonthYear.split('/');
    const previousMonthLuxon = getPreviousMonthLuxon(Number.parseInt(month), Number.parseInt(year));
    monthToFetch = previousMonthLuxon.month;
    yearToFetch = previousMonthLuxon.year;
  }

  const previousMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    monthToFetch.toString(),
    yearToFetch.toString(),
  );

  const isThisMonthMoreThanPreviousMonth = currentMonthData.totalBillsCost > previousMonthData.totalBillsCost;
  const monthDifference = Math.abs(currentMonthData.totalBillsCost - previousMonthData.totalBillsCost);
  console.log(currentMonthData);
  return (
    <div className="flex w-full flex-col justify-start gap-y-1">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-1">
          <Typography>Selected Month:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body2">
            { currentMonthData.totalBillsCount }
          </Typography>
        </div>
        <Separator orientation="vertical" />
        <div className={ `
          flex flex-wrap space-x-1
          *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
        ` }>
          { currentMonthData.billDues
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

      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-1">
          <Typography>Previous Month:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body2">
            { previousMonthData.totalBillsCount }
          </Typography>
        </div>
        <Separator orientation="vertical" />
        <div className={ `
          flex flex-wrap space-x-1
          *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
        ` }>
          { previousMonthData.billDues
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
    </div>
  );
}
