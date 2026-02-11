'use client';

import useIsClient from '@/hooks/useIsClient';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { SubscriptionWithBillDues, SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';

import SubscriptionsTableParentRow from './SubscriptionsTableParentRow';
import SubscriptionsTableParentLoading from './SubscriptionsTableParentLoading';

interface Props {
  subscriptions: SubscriptionWithBillDuesAndSortData;
}

export default function SubscriptionsTableParentWrapper({ subscriptions }: Props) {
  const isClient = useIsClient();
  const columnsSorted: SearchTableColumn[] = SUBSCRIPTIONS_TABLE_COLUMN_IDS.sort((a, b) => a.ordinal - b.ordinal);

  if (!isClient) {
    return <SubscriptionsTableParentLoading />;
  }

  return (
    <Table className="table-fixed">
      <TableHeader className={ `bg-muted` }>
        <TableRow className="hover:bg-transparent">
          { columnsSorted.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => {
            return (
              <SearchTableHeaderDisplay
                key={ column.headerId }
                columnId={ column.headerId }
                index={ index }
                length={ array.length }
                sortData={ subscriptions.sortData }
                pageId={ SORT_DATA_PAGE_IDS.subscriptions }
                sortable={ column.sortable ?? false }
              />
            );
          }) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { subscriptions.subscriptions.map((subscription: SubscriptionWithBillDues) => (
          <SubscriptionsTableParentRow key={ subscription.id } subscription={ subscription } />
        )) }
      </TableBody>
    </Table>
  );
}
