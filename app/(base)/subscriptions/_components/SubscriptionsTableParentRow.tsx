import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableCellDisplay from '@/shared/table/SubscriptionsTableCellDisplay';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';

import SubscriptionsTableParentRowWrapper from './SubscriptionsTableParentRowWrapper';

export default function SubscriptionsTableParentRow({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <SubscriptionsTableParentRowWrapper key={ subscription.id } subscription={ subscription }>
      AA
    </SubscriptionsTableParentRowWrapper>
  );
}
