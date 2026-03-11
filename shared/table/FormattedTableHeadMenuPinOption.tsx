import { Pin } from 'lucide-react';

import { TableId, AppColumnId, useTableColumnsActions } from '@/store/subscriptions/table.store';
import { DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

type Props = {
  onAction: () => void;
  tableId: TableId;
  columnId: AppColumnId;
};

export default function FormattedTableHeadMenuPinOption({ onAction, tableId, columnId }: Props) {
  const { pinColumn } = useTableColumnsActions();

  const handlePinColumn = () => {
    pinColumn(columnId, tableId);
    onAction();
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="text-foreground/50">Position</DropdownMenuLabel>
      <DropdownMenuItem onClick={ handlePinColumn } className="cursor-pointer">
        <Pin className="size-4" />
        Pin this column
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
