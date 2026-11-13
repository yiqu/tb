import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionDetailsStatsLoading from './_components/SubscriptionDetailsStatsLoading';
import Typography from '@/components/typography/Typography';

export default function SubscriptionDetailsLoading() {
  return <LoadingMask />;
}

function LoadingMask() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <div className="@container flex w-full flex-col items-start justify-start gap-y-3">
          { /* the details strip: six fields in two columns, then three, then one row */ }
          <Skeleton className="h-65 w-full @3xl:h-37 @6xl:h-21" />
          <SubscriptionDetailsStatsLoading />
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-y-6">
          <Typography variant="h3">Bill Dues</Typography>
          <Skeleton className="h-200 w-full" />
        </div>
      </div>
    </div>
  );
}
