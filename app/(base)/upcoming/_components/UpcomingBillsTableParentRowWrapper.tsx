'use client';

import { cn } from '@/lib/utils';
import { TableRow } from '@/components/ui/table';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import billsTableViewStore, { BillDueIdBeingEdited } from '@/store/bills/bills.store';

export default function UpcomingBillsTableParentRowWrapper({ billDue, children }: { billDue: BillDueWithSubscription; children: React.ReactNode }) {
  const billDueIdBeingEdited: BillDueIdBeingEdited = billsTableViewStore.use.billDueIdBeingEdited();

  return (
    <TableRow
      className={ cn('hover:bg-muted/20', {
        'bg-yellow-500/20 hover:bg-yellow-500/20': billDueIdBeingEdited[billDue.id] === true,
      }) }
    >
      { children }
    </TableRow>
  );
}
