'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import DialogContentWrapper from './DialogContentWrapper';

export default function DialogContent({ ids }: { ids: string[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dialog Mode</Button>
      </DialogTrigger>
      <DialogContentWrapper ids={ ids } />
    </Dialog>
  );
}
