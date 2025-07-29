'use client';

import { RotateCcw } from 'lucide-react';
import { X, Save, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

export default function AddNewBillDueDialogFooter() {
  return (
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
        <ResetButton />
        <Button type="submit" id="add-new-bill-due-dialog-save-button" disabled={ false } form="add-new-bill-due-dialog-form">
          <Plus />
          Add
        </Button>
      </div>
    </DialogFooter>
  );
}

function ResetButton() {
  const {
    reset,
    formState: { isDirty },
  } = useFormContext();

  if (!isDirty) {
    return null;
  }

  return (
    <Button
      variant="outline"
      type="button"
      id="edit-bill-dialog-reset-button"
      onClick={ () => {
        reset();
      } }
    >
      <RotateCcw />
      Reset
    </Button>
  );
}
