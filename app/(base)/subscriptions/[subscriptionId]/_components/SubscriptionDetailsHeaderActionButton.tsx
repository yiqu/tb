import { Trash, Pencil, EllipsisVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import SubscriptionDetailsHeaderActionButtonAddNewBillDue from './SubscriptionDetailsHeaderActionButtonAddNewBillDue';

export function SubscriptionDetailsHeaderActionButton({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <EllipsisVerticalIcon className="h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end">
        <DropdownMenuLabel>Bills</DropdownMenuLabel>
        <DropdownMenuGroup>
          <SubscriptionDetailsHeaderActionButtonAddNewBillDue subscriptionId={ subscription } />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Pencil className="h-4 w-4" />
            Edit subscription
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="h-4 w-4" />
            Delete subscription
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
