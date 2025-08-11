'use client';

import { useQueryState } from 'nuqs';
import { Plus, EllipsisVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function SubscriptionsActionBarActionsMenu() {
  const [, setAddNewSubscription] = useQueryState('addNewSubscription', {
    scroll: false,
  });

  const handleOnClick = () => {
    setAddNewSubscription('true', {
      scroll: false,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <EllipsisVerticalIcon className="h-4 w-4" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
