'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useIsClient from '@/hooks/useIsClient';
import SearchTableCell from '@/shared/table/SearchTableCellDisplay';
import FormattedTableHeader from '@/shared/table/FormattedTableHeader';
import FormattedTableHeadFiller from '@/shared/table/FormattedTableHeadFiller';
import FormattedTableCellFiller from '@/shared/table/FormattedTableCellFiller';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SortDataModel, SortDataPageId } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import useOrderedVisibleTableColumns from '@/hooks/table-columns-adjust/useOrderedVisibleTableColumns';

interface SearchTableContentProps {
  billDues: BillDueWithSubscription[];
  sortData: SortDataModel | null;
  pageId: SortDataPageId;
}

/**
 * Client half of the search table. The visible columns come from local storage, so the table is
 * rendered after mount to keep the markup in sync with the persisted show/hide configuration.
 */
export default function SearchTableContent({ billDues, sortData, pageId }: SearchTableContentProps) {
  const isClient = useIsClient();
  const columnsSorted: string[] = useOrderedVisibleTableColumns('search');

  if (!isClient) {
    return <Skeleton className="h-[20rem] w-full" />;
  }

  return (
    <Table className={ `table-fixed` }>
      <TableHeader className="bg-muted">
        <TableRow className="hover:bg-transparent">
          { columnsSorted.map((column: string, index: number) => {
            return (
              <FormattedTableHeader
                tableId="search"
                key={ column }
                columnId={ column }
                index={ index }
                sortData={ sortData }
                pageId={ pageId }
              />
            );
          }) }
          <FormattedTableHeadFiller />
        </TableRow>
      </TableHeader>
      <TableBody>
        { billDues.map((billDue: BillDueWithSubscription) => (
          <TableRow key={ billDue.id }>
            { columnsSorted.map((column: string) => (
              <SearchTableCell key={ column } colId={ column } billDue={ billDue } />
            )) }
            <FormattedTableCellFiller />
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}
