import Typography from '@/components/typography/Typography';
import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';

import SubscriptionDetailsBillsTable from './SubscriptionDetailsBillsTable';

interface SubscriptionDetailsBillsTableProps {
  billDues: BillsDueGroupedByYearObject[];
}

export default function SubscriptionDetailsBillsTableParent({ billDues }: SubscriptionDetailsBillsTableProps) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-6">
      <Typography variant="h3">Bill Dues</Typography>
      { billDues.map((billDue: BillsDueGroupedByYearObject) => {
        return (
          <div key={ billDue.year } className="flex w-full flex-col items-start justify-start gap-y-3">
            <Typography variant="h4">{ billDue.year }</Typography>
            <SubscriptionDetailsBillsTable billDues={ billDue.bills } />
          </div>
        );
      }) }
    </div>
  );
}
