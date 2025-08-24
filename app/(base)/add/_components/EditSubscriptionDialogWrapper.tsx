'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import Typography from '@/components/typography/Typography';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

export default function EditSubscriptionDialogWrapper({ children }: { children: ReactNode }) {
  const [editSubscriptionId, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    scroll: false,
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setEditSubscriptionId(null, {
        scroll: false,
      });
    }
  };

  if (!editSubscriptionId) {
    return null;
  }

  return (
    <Dialog open={ !!editSubscriptionId } onOpenChange={ handleOnOpenChange }>
      <StyledDialogContent
        headerTitle="Edit Subscription"
        headerDescription={
          <div className="flex w-full flex-row items-center justify-between gap-x-1">
            <div className="flex flex-row items-center justify-start gap-x-1">
              <Typography>Make changes to your subscription.</Typography>
            </div>
          </div>
        }
      >
        { children }
      </StyledDialogContent>
    </Dialog>
  );
}
