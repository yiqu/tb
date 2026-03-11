import { ListFilter } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import UncontrolledInput from '@/components/hook-form/UnInput';
import { TableId, AppColumnId } from '@/store/subscriptions/table.store';
import useTableFilterMenuFilterByQuery from '@/hooks/useTableFilterMenuFilterByQuery';
import {
  DropdownMenuSub,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

import ColumnStack from '../components/ColumnStack';

type Props = {
  tableId: TableId;
  columnId: AppColumnId;
};

export default function FormattedTableHeadMenuFilterOption({ tableId, columnId }: Props) {
  const { filterValue } = useTableFilterMenuFilterByQuery(tableId, columnId);
  const hasFilterValue = !!filterValue;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-foreground/50">Filter</DropdownMenuLabel>
        <DropdownMenuSub defaultOpen={ hasFilterValue }>
          <DropdownMenuSubTrigger
            className={ cn('cursor-pointer', {
              'bg-accent text-accent-foreground': hasFilterValue,
            }) }
          >
            <ListFilter className="size-4" />
            Filter By
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-64 p-4">
            <FormattedTableHeadMenuFilterOptionContent columnId={ columnId } tableId={ tableId } />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </>
  );
}

function FormattedTableHeadMenuFilterOptionContent({ columnId, tableId }: Props) {
  const { filterValue, setFilterValueWithOptions } = useTableFilterMenuFilterByQuery(tableId, columnId);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValueWithOptions(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      // Send immediate update
      setFilterValueWithOptions((e.target as HTMLInputElement).value);
    }
  };

  const handleOnClear = () => {
    setFilterValueWithOptions('');
  };

  return (
    <ColumnStack className="gap-y-2">
      <Label className="text-sm font-medium">Filter value</Label>
      <UncontrolledInput
        placeholder="Enter filter text..."
        onKeyDown={ handleOnKeyDown }
        onPointerDown={ (e) => e.stopPropagation() }
        onFocus={ (e) => e.target.select() }
        onChange={ handleOnChange }
        value={ filterValue }
        className={ filterValue ? 'pr-8' : '' }
        onClear={ handleOnClear }
      />
    </ColumnStack>
  );
}
