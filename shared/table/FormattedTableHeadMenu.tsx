'use client';

import { useState } from 'react';
import { Pin, EllipsisVertical } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppSetting } from '@/providers/AppSettingProvider';
import { TableId, useTableColumnsActions } from '@/store/subscriptions/table.store';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FormattedTableHeadMenuProps = {
  columnId: string;
  tableId: TableId;
};

export default function FormattedTableHeadMenu({ columnId, tableId }: FormattedTableHeadMenuProps) {
  const { isCompactMode } = useAppSetting();
  const [isOpen, setIsOpen] = useState(false);
  const { pinColumn } = useTableColumnsActions();

  const handlePinColumn = () => {
    pinColumn(columnId, tableId);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={ isOpen } onOpenChange={ setIsOpen }>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={ cn(
            `
              ml-auto flex size-6 shrink-0 items-center justify-center rounded-md transition-opacity
              hover:bg-sidebar-accent/50
            `,
            isCompactMode && !isOpen && `
              opacity-0
              group-hover/header:opacity-100
            `,
            isOpen && 'opacity-100',
          ) }
        >
          <EllipsisVertical className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-foreground/50">Position</DropdownMenuLabel>
          <DropdownMenuItem onClick={ handlePinColumn } className="cursor-pointer">
            <Pin className="size-4" />
            Pin this column
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
