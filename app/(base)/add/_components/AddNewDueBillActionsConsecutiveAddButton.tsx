'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import billsTableViewStore, { BillDueIdBeingEdited } from '@/store/bills/bills.store';

export default function AddNewDueBillActionsConsecutiveAddButton({ children }: { children: ReactNode }) {
  const billDueIdBeingEdited: BillDueIdBeingEdited = billsTableViewStore.use.billDueIdBeingEdited();
  const isNewBillDue: boolean = billDueIdBeingEdited['new-bill-due'] === true;

  return (
    <Button variant="default" type="submit" className="w-full" form="add-new-bill-due-page-form" disabled={ isNewBillDue }>
      { children }
    </Button>
  );
}
