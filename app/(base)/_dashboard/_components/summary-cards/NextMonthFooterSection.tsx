import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';

const usdFormatter = getUSDFormatter();

interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
}

export default async function NextMonthFooterSection({ currentMonthData, selectedMonthYear }: Props) {
  const nextMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, 1);

  const isMonthSameAsNextMonth: boolean = currentMonthData.totalBillsCost === nextMonthData.totalBillsCost;
  const isThisMonthMoreThanNextMonth = currentMonthData.totalBillsCost > nextMonthData.totalBillsCost;
  const monthDifference: number = Math.abs(currentMonthData.totalBillsCost - nextMonthData.totalBillsCost);

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <div>
        { isMonthSameAsNextMonth ?
          <Typography>
            Bills cost will be the <span className="font-semibold">same</span> next month.
          </Typography>
        : <Typography>
          Bills cost will{ ' ' }
          <span className="font-semibold tabular-nums">
            { isThisMonthMoreThanNextMonth ? 'decrease' : 'increase' } by { usdFormatter.format(monthDifference) }
          </span>{ ' ' }
          next month.
        </Typography>
        }
      </div>
    </div>
  );
}
