import { Skeleton } from '@/components/ui/skeleton';

export default function SubscriptionDetailsLoading() {
  return <LoadingMask />;
}

function LoadingMask() {
  return <Skeleton className="min-h-[50rem] w-full" />;
}
