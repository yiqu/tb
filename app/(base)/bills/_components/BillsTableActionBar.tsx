import { Separator } from '@/components/ui/separator';

import BillsActionBarRefreshButton from './BillsActionBarRefreshButton';
import BillsActionBarDueDateFilter from './BillsActionBarDueDateFilter';
import BillsActionBarFrequencyFilter from './BillsActionBarFrequencyFilter';
import BillsActionBarSubscriptionFilter from './BillsActionBarSubscriptionFilterWrapper';

export default function BillsTableActionBar() {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2 flex-wrap gap-y-2">
      <BillsActionBarRefreshButton />
      <Separator orientation="vertical" className="h-[1.5rem]!" />
      <BillsActionBarSubscriptionFilter />
      <BillsActionBarFrequencyFilter />
      <Separator orientation="vertical" className="h-[1.5rem]!" />
      <BillsActionBarDueDateFilter />
    </div>
  );
}
