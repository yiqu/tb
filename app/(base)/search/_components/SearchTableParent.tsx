/* eslint-disable quote-props */
/* eslint-disable better-tailwindcss/multiline */

import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CardContent } from '@/components/ui/card';
import { getAllBills } from '@/server/bills/bills.server';
import DisplayCard from '@/shared/components/DisplayCard';
import SearchTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { Table, TableRow, TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS, getSearchTableColumnWidth } from '@/shared/table/table.utils';

export default async function SearchTableParent() {
  const billDues: BillDueWithSubscription[] = await getAllBills();

  // console.log('billDues: ', billDues);

  return (
    <DisplayCard className="w-full">
      <CardContent>
        { /* <Table>
          <TableHeader>
            <TableRow>
              { SEARCH_TABLE_COLUMN_IDS.map((column) => (
                <TableHead
                  key={ column.headerId }
                  className={ cn('', {
                    [`w-[${getSearchTableColumnWidth(column.headerId)}]`]: !!getSearchTableColumnWidth(column.headerId),
                  }) }
                >
                  <span className="flex flex-row items-center justify-start gap-x-2">
                    { column.headerId }
                    <ChevronsUpDown className="size-4" />
                  </span>
                </TableHead>
              )) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.map((billDue: BillDueWithSubscription) => (
              <TableRow key={ billDue.id }>
                { SEARCH_TABLE_COLUMN_IDS.map((column: SearchTableColumn) => (
                  <SearchTableCell key={ column.headerId } colId={ column.headerId } billDue={ billDue } />
                )) }
              </TableRow>
            )) }
          </TableBody>
        </Table> */ }
      </CardContent>
    </DisplayCard>
  );
}
