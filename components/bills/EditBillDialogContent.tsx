/* eslint-disable better-tailwindcss/multiline */

import { X, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

import EditBillForm from './EditBillForm';

export default function EditBillDialogContent() {
  return (
    <DialogContent className={ `overflow-x-auto px-0 pb-0 two:w-[800px] two:max-w-[1000px]! main:w-[1000px] main:max-w-[1200px]!` }>
      <DialogHeader className="px-4">
        <DialogTitle>Edit Bill</DialogTitle>
        <DialogDescription>Make changes to your bill.</DialogDescription>
      </DialogHeader>
      <div className="px-4">
        <EditBillForm />
      </div>
      <DialogFooter className="flex w-full flex-row bg-sidebar p-4 sm:items-center sm:justify-between">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            <X />
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit">
            <Save />
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
