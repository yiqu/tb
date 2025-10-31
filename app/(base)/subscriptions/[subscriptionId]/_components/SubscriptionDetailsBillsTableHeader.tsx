import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

interface Props {
  billDues: BillDueWithSubscription[];
  year: string;
}

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsBillsTableHeader({ billDues, year }: Props) {
  const billDuesCount = billDues.length;
  const billDuesTotalCost = billDues.reduce((acc, billDue) => acc + (billDue.cost ?? 0), 0);

  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <Typography variant="h4">
        { year }: Bills: { billDuesCount } | Total: { usdFormatter.format(billDuesTotalCost) }
      </Typography>
    </div>
  );
}
