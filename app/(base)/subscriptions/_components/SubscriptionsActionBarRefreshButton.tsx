'use client';

import { useTransition } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { revalidateSubscriptions } from '@/server/subscriptions/subscriptions.server';

export default function SubscriptionsActionBarRefreshButton() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleOnRefreshSubscriptions = () => {
    startTransition(async () => {
      await queryClient.invalidateQueries({
        queryKey: [],
      });
      await revalidateSubscriptions();
    });
  };

  return (
    <Button variant="outline" size="default" className="bg-card" onClick={ handleOnRefreshSubscriptions } disabled={ isPending }>
      <RefreshCcw
        className={ cn(`size-4`, {
          'animate-spin': isPending,
        }) }
      />
      Refresh
    </Button>
  );
}
