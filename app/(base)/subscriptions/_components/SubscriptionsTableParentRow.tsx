'use client';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableCellDisplay from '@/shared/table/SubscriptionsTableCellDisplay';
import { useColumnOrdinalObject, SUBSCRIPTIONS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';

import SubscriptionsTableParentRowWrapper from './SubscriptionsTableParentRowWrapper';

export default function SubscriptionsTableParentRow({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const columnsOrderedByOrdinal = useColumnOrdinalObject('subscriptions');
  const columnsSorted: string[] = [...SUBSCRIPTIONS_TABLE_COLUMNS].toSorted(
    (a: string, b: string) =>
      (columnsOrderedByOrdinal[a as keyof typeof columnsOrderedByOrdinal] ?? 0) -
      (columnsOrderedByOrdinal[b as keyof typeof columnsOrderedByOrdinal] ?? 0),
  );
  return (
    <SubscriptionsTableParentRowWrapper key={ subscription.id } subscription={ subscription }>
      { columnsSorted.map((column: string) => (
        <SubscriptionsTableCellDisplay key={ column } colId={ column } subscription={ subscription } />
      )) }
    </SubscriptionsTableParentRowWrapper>
  );
}
