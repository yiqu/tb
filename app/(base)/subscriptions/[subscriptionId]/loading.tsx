import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function SubscriptionDetailsLoading() {
  return <LoadingMask />;
}

function LoadingMask() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <div className="flex w-full flex-col items-start justify-start gap-y-3">
          <Skeleton className="h-21 w-full" />
          <Skeleton className="h-31.5 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-y-6">
          <Typography variant="h3">Bill Dues</Typography>
          <Skeleton className="h-200 w-full" />
        </div>
      </div>
    </div>
  );
}
