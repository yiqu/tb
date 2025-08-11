'use client';

import { ReactNode } from 'react';

import { DialogTitle, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

import { Separator } from '../ui/separator';
import Typography from '../typography/Typography';
import AddSubscriptionDialogContentFooter from './AddSubscriptionDialogContentFooter';
import AddSubscriptionDialogContentFormWrapper from './AddSubscriptionDialogContentFormWrapper';

export default function AddSubscriptionDialogContent({ children }: { children: ReactNode }) {
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
        <DialogTitle>Add Subscription</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-row items-center justify-between gap-x-1">
            <div className="flex flex-row items-center justify-start gap-x-1">
              <Typography>Add a new subscription.</Typography>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <AddSubscriptionDialogContentFormWrapper>
        <div className="px-4">{ children }</div>
        <AddSubscriptionDialogContentFooter />
      </AddSubscriptionDialogContentFormWrapper>
    </DialogContent>
  );
}
