import { X } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

export default function StyledDialogFooter({ children }: { children?: ReactNode }) {
  return (
    <DialogFooter className={ `sticky bottom-0 z-10 mt-4 flex w-full bg-sidebar p-4` }>
      { children ?
        children
      : <div className="flex flex-row items-center justify-between gap-x-2">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            <X />
            Cancel
          </Button>
        </DialogClose>
        <div> </div>
      </div>
      }
    </DialogFooter>
  );
}
