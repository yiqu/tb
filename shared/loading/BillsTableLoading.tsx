/* eslint-disable react/no-array-index-key */

import { Skeleton } from '@/components/ui/skeleton';
import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from '@/components/ui/table';

type Props = {
  rowCount?: number;
};

export default function BillsTableLoading({ rowCount = 10 }: Props) {
  return (
    <Table className="table-auto" style={ { minWidth: '100%' } }>
      <TableHeader className={ `bg-muted` }>
        <TableRow>
          { BILLS_TABLE_COLUMNS.map((column: string, index: number) => (
            <TableHead key={ `header-${index}` } className="p-2">
              { /* <Skeleton className={ `h-6` } /> */ }
            </TableHead>
          )) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow
            key={ `row-${rowIndex}` }
            className="
              border-none
              hover:bg-transparent
            "
            style={ { opacity: Math.max(0, 1 - rowIndex / (rowCount - 1)) } }
          >
            { BILLS_TABLE_COLUMNS.map((column: string, colIndex: number) => (
              <TableCell key={ `cell-${colIndex}` } className="p-2">
                <Skeleton className={ `h-10` } />
              </TableCell>
            )) }
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}
