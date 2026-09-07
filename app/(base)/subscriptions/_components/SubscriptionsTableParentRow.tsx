'use client';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableCellDisplay from '@/shared/table/SubscriptionsTableCellDisplay';
import useOrderedVisibleTableColumns from '@/hooks/table-columns-adjust/useOrderedVisibleTableColumns';

import SubscriptionsTableParentRowWrapper from './SubscriptionsTableParentRowWrapper';

export default function SubscriptionsTableParentRow({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const columnsSorted: string[] = useOrderedVisibleTableColumns('subscriptions');
  return (
    <SubscriptionsTableParentRowWrapper key={ subscription.id } subscription={ subscription }>
      { columnsSorted.map((column: string, index: number) => (
        <SubscriptionsTableCellDisplay
          key={ column }
          colId={ column }
          subscription={ subscription }
          showVerticalBorder
          isSticky={ index === 0 }
        />
      )) }
    </SubscriptionsTableParentRowWrapper>
  );
}
