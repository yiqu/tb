import { getUSDFormatter } from '@/lib/number.utils';
import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';
import { YearlyBillsData } from '@/models/bills/yearly-bills.model';

const usdFormatter = getUSDFormatter();

export default function YearlyBillsYearSummary({ yearlyBills }: { yearlyBills: YearlyBillsData }) {
  return (
    <RowStack className="w-full flex-wrap items-baseline gap-x-2 gap-y-1">
      <Typography variant="h4">{ yearlyBills.year }</Typography>
      <Typography variant="label1">
        { usdFormatter.format(yearlyBills.totalDue) } due across { yearlyBills.billsCount } { yearlyBills.billsCount === 1 ? 'bill' : 'bills' }{ ' ' }
        from { yearlyBills.subscriptionsCount } { yearlyBills.subscriptionsCount === 1 ? 'subscription' : 'subscriptions' }
      </Typography>
    </RowStack>
  );
}
