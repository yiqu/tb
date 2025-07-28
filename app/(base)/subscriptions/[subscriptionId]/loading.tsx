import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';

export default function SubscriptionDetailsLoading() {
  return <LoadingMask />;
}

function LoadingMask() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-9">
      <div className="flex w-full flex-row items-center justify-between">
        <Skeleton className="h-9 w-[10rem]" />
        <Skeleton className="h-9 w-[10rem]" />
      </div>
      <div className="flex w-full flex-col items-start justify-start gap-y-6">
        <DisplayCard className="h-[535px] w-full">
          <CardContent className="overflow-hidden">
            <Skeleton className="h-[50rem] w-full" />
          </CardContent>
        </DisplayCard>

        <div className="flex w-full flex-col items-start justify-start gap-y-6">
          <Typography variant="h3">Bill Dues</Typography>
          <Skeleton className="h-[50rem] w-full" />
        </div>
      </div>
    </div>
  );
}
