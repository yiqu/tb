'use client';

import { useQueryState } from 'nuqs';
import { Fullscreen } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SUBSCRIPTION_DETAILS_DIALOG_ID } from './utils';

export default function SubscriptionDetailsDialogOpenButton({ subscriptionId }: { subscriptionId: string }) {
  const [, setSubscriptionDetailsDialogId] = useQueryState(SUBSCRIPTION_DETAILS_DIALOG_ID);

  const handleOnOpenDialog = () => {
    setSubscriptionDetailsDialogId(subscriptionId, {
      history: 'push'
    });
  };

  return (
    <Button variant="ghost" size="icon-sm" type="button" title="Open in dialog" onClick={ handleOnOpenDialog }>
      <Fullscreen />
    </Button>
  );
}
