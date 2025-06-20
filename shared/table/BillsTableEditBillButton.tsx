import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import EditBillDialogContent from '@/components/bills/EditBillDialogContent';

export default function BillsTableEditBillButton({ billDue }: { billDue: BillDueWithSubscription }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6" type="button">
          <Pencil />
        </Button>
      </DialogTrigger>

      <EditBillDialogContent billDue={ billDue } />
    </Dialog>
  );
}
