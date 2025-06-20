import { X, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { DialogClose, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

import EditBillForm from './EditBillForm';
import EditBillDialogFormWrapper from './EditBillDialogFormWrapper';
import EditBillDialogResetButton from './EditBillDialogResetButton';

export default function EditBillDialogContent({ billDue }: { billDue: BillDueWithSubscription }) {
  return (
    <DialogContent
      className={ `
        overflow-x-auto px-0 pb-0
        two:w-[800px] two:max-w-[1000px]!
        main:w-[1000px] main:max-w-[1200px]!
        sm:max-w-[600px]
      ` }
    >
      <DialogHeader className="px-4">
        <DialogTitle>Edit Bill</DialogTitle>
        <DialogDescription>Make changes to your bill.</DialogDescription>
      </DialogHeader>
      <EditBillDialogFormWrapper billDue={ billDue }>
        <div className="px-4">
          <EditBillForm />
        </div>
        <DialogFooter className={ `
          mt-4 flex w-full flex-row bg-sidebar p-4
          sm:items-center sm:justify-between
        ` }>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              <X />
              Cancel
            </Button>
          </DialogClose>
          <div className="flex flex-row items-center justify-end gap-x-2">
            <EditBillDialogResetButton />
            <Button type="submit" className="w-[90px]" id="edit-bill-dialog-save-button">
              <Save />
              Save
            </Button>
          </div>
        </DialogFooter>
      </EditBillDialogFormWrapper>
    </DialogContent>
  );
}
