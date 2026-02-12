import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableCellDisplay from '@/shared/table/SubscriptionsTableCellDisplay';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';

import SubscriptionsTableParentRowWrapper from './SubscriptionsTableParentRowWrapper';

export default function SubscriptionsTableParentRow({ subscription }: { subscription: SubscriptionWithBillDues }) {
  // const testColumns = SUBSCRIPTIONS_TABLE_COLUMN_IDS.slice(0, 5);
  return (
    <SubscriptionsTableParentRowWrapper key={ subscription.id } subscription={ subscription }>
      { SUBSCRIPTIONS_TABLE_COLUMN_IDS.map((column: SearchTableColumn) => (
        <SubscriptionsTableCellDisplay key={ column.headerId } colId={ column.headerId } subscription={ subscription } />
      )) }
    </SubscriptionsTableParentRowWrapper>
  );
}
