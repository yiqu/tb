import { getUSDFormatter } from '@/lib/number.utils';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import OutstandingCount from '@/components/counts/OutstandingCount';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';

const usdFormatter = getUSDFormatter();
interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
}

export default async function CurrentMonthSubTextSection({ currentMonthData, selectedMonthYear }: Props) {
  const previousMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, -1);
  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        <div className="flex min-w-25 flex-row items-center justify-start gap-x-1">
          <Typography className="min-w-14">Current:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body1">
            { currentMonthData.totalBillsCount }
            { ` ` }
            <span className={ `
              text-red-700
              dark:text-red-400
            ` }>
              (<OutstandingCount selectedMonthYear={ selectedMonthYear } showTooltip />)
            </span>
          </Typography>
        </div>
        <Separator orientation="vertical" className="h-4!" />
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
        <div className="flex min-w-25 flex-row items-center justify-start gap-x-1">
          <Typography className="">Previous:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body1">
            { previousMonthData.totalBillsCount }
            { ` ` }
            <span className={ `
              text-red-700
              dark:text-red-400
            ` }>
              (<OutstandingCount selectedMonthYear={ `${previousMonthData.monthParams}/${previousMonthData.yearParams}` } showTooltip />)
            </span>
          </Typography>
        </div>
        <Separator orientation="vertical" className="h-4!" />
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
          <Typography className="ml-1 font-semibold tabular-nums">({ usdFormatter.format(previousMonthData.totalBillsCost) })</Typography>
        </div>
      </div>
    </div>
  );
}
