import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';

const usdFormatter = getUSDFormatter();
interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
}

export default async function CurrentMonthFooterSection({ currentMonthData, selectedMonthYear }: Props) {
  const previousMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, -1);

  const isMonthSameAsPreviousMonth: boolean = currentMonthData.totalBillsCost === previousMonthData.totalBillsCost;
  const isThisMonthMoreThanPreviousMonth = currentMonthData.totalBillsCost > previousMonthData.totalBillsCost;
  const monthDifference: number = Math.abs(currentMonthData.totalBillsCost - previousMonthData.totalBillsCost);

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <div>
        { isMonthSameAsPreviousMonth ?
          <Typography>
            Bills cost is the <span className="font-semibold">same</span> as previous month.
          </Typography>
        : <Typography>
          Bills cost{ ' ' }
          <span className="font-semibold tabular-nums">
            { isThisMonthMoreThanPreviousMonth ? 'increased' : 'decreased' } by { usdFormatter.format(monthDifference) }
          </span>{ ' ' }
          compared to previous month.
        </Typography>
        }
      </div>
    </div>
  );
}
