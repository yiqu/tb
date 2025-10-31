import NoData from '@/components/no-data/NoData';
import Typography from '@/components/typography/Typography';
import { BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsBillsTable from './SubscriptionDetailsBillsTable';
import SubscriptionDetailsBillsTableHeader from './SubscriptionDetailsBillsTableHeader';

interface SubscriptionDetailsBillsTableProps {
  billDues: BillsDueGroupedByYearObject[];
  subscription: SubscriptionWithBillDues;
}

export default function SubscriptionDetailsBillsTableParent({ billDues, subscription }: SubscriptionDetailsBillsTableProps) {
  if (billDues.length === 0) {
    return <NoData type="bills" subscription={ subscription } />;
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-6">
      <Typography variant="h3">Bill Dues</Typography>
      { billDues.map((billDue: BillsDueGroupedByYearObject) => {
        return (
          <div key={ billDue.year } className="flex w-full flex-col items-start justify-start gap-y-3">
            <SubscriptionDetailsBillsTableHeader billDues={ billDue.bills } year={ billDue.year } />
            <SubscriptionDetailsBillsTable billDues={ billDue.bills } />
          </div>
        );
      }) }
    </div>
  );
}
