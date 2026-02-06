'use client';

import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';
import { Plus, Trash, RefreshCcw, EllipsisVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { deleteAllSubscriptions } from '@/server/subscriptions/subscriptions.server';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface SubscriptionsActionBarActionsMenuProps {
  showDeleteAllSubscriptionsOption: boolean;
}

export default function SubscriptionsActionBarActionsMenu({ showDeleteAllSubscriptionsOption }: SubscriptionsActionBarActionsMenuProps) {
  const [isPending, startTransition] = useTransition();
  const [, setAddNewSubscription] = useQueryState('addNewSubscription', {
    scroll: false,
  });

  const handleOnClick = () => {
    setAddNewSubscription('true', {
      scroll: false,
    });
  };

  const handleOnDeleteAllSubscriptions = () => {
    const confirm = window.confirm('Are you sure you want to delete all subscriptions? This action cannot be undone.');
    if (confirm) {
      startTransition(async () => {
        await toast.promise(deleteAllSubscriptions(), {
          loading: 'Deleting all subscriptions...',
          success: (_res: void) => {
            return 'All subscriptions deleted.';
          },
          error: 'Failed to delete all subscriptions.',
        });
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="default">
          <EllipsisVerticalIcon />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end">
        <DropdownMenuLabel>Subscriptions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={ handleOnClick }>
            <Plus className="h-4 w-4" />
            Add new subscription
          </DropdownMenuItem>
        </DropdownMenuGroup>
        { showDeleteAllSubscriptionsOption ?
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={ handleOnDeleteAllSubscriptions } disabled={ isPending }>
                { isPending ?
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                : <Trash className="h-4 w-4" /> }
                Delete all subscriptions
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        : null }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
