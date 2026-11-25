'use client';

import { ReactNode } from 'react';

import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

interface PixelPalsDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  title: string;
  description: string;
  /** The form. It mounts each time the dialog opens, so it always starts fresh. */
  children: ReactNode;
}

/** The shell of the Spawn, Delete and Change theme dialogs. */
export default function PixelPalsDialog({ open, onOpenChange, title, description, children }: PixelPalsDialogProps) {
  return (
    <Dialog open={ open } onOpenChange={ onOpenChange }>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
          <DialogDescription>{ description }</DialogDescription>
        </DialogHeader>
        { children }
      </DialogContent>
    </Dialog>
  );
}
