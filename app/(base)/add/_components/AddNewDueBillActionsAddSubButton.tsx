'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { BillDueIdBeingEdited, useGetBillDueIdBeingEdited } from '@/store/bills/bills.store';

export default function AddNewDueBillActionsAddSubButton({ children }: { children: ReactNode }) {
  const billDueIdBeingEdited: BillDueIdBeingEdited = useGetBillDueIdBeingEdited();
  const isNewBillDue: boolean = billDueIdBeingEdited['new-bill-due'] === true;

  return (
    <Button variant="default" type="submit" className="w-full" form="add-new-bill-due-page-form" disabled={ isNewBillDue }>
      { children }
    </Button>
  );
}
