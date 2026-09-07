import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import BillsTableLoading from '@/shared/loading/BillsTableLoading';

/** Fixed: BillsTableLoading's row fade divides by `rowCount - 1`, so it needs more than one row. */
const LOADING_MASK_ROW_COUNT = 10;

/**
 * The bill dues table's loading mask.
 *
 * Shared by the page's Suspense fallback (while the bill dues are fetched) and by the table's own
 * client render gate (while local storage column state is read), so the two run into each other as
 * one continuous skeleton instead of two different looking ones.
 */
export default function SubscriptionDetailsBillsTableLoading() {
  return (
    <DisplayCard className="w-full py-0">
      <CardContent className="overflow-x-auto px-0">
        <BillsTableLoading rowCount={ LOADING_MASK_ROW_COUNT } />
      </CardContent>
    </DisplayCard>
  );
}
