'use client';

import { useColumnOrdinalObject } from '@/store/subscriptions/table.store';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableCellDisplay from '@/shared/table/SubscriptionsTableCellDisplay';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';

import SubscriptionsTableParentRowWrapper from './SubscriptionsTableParentRowWrapper';

export default function SubscriptionsTableParentRow({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const columnsOrderedByOrdinal = useColumnOrdinalObject();
  const columnsSorted: SearchTableColumn[] = [...SUBSCRIPTIONS_TABLE_COLUMN_IDS].toSorted(
    (a, b) =>
      (columnsOrderedByOrdinal[a.headerId as keyof typeof columnsOrderedByOrdinal] ?? 0) -
      (columnsOrderedByOrdinal[b.headerId as keyof typeof columnsOrderedByOrdinal] ?? 0),
  );
  return (
    <SubscriptionsTableParentRowWrapper key={ subscription.id } subscription={ subscription }>
      { columnsSorted.map((column: SearchTableColumn) => (
        <SubscriptionsTableCellDisplay key={ column.headerId } colId={ column.headerId } subscription={ subscription } />
      )) }
    </SubscriptionsTableParentRowWrapper>
  );
}
