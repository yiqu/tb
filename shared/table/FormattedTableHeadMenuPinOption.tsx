import { Pin } from 'lucide-react';

import { TableId, AppColumnId, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

type Props = {
  onAction: () => void;
  tableId: TableId;
  columnId: AppColumnId;
  columnIndex: number;
};

export default function FormattedTableHeadMenuPinOption({ onAction, tableId, columnId, columnIndex }: Props) {
  const { pinColumn } = useTableColumnsActions();
  const isPinDisabled = columnIndex === 0;

  const handlePinColumn = () => {
    pinColumn(columnId, tableId);
    onAction();
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-foreground/50">Position</DropdownMenuLabel>
      <DropdownMenuItem onClick={ handlePinColumn } className="cursor-pointer" disabled={ isPinDisabled }>
        <Pin className="size-4" />
        Pin this column
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
