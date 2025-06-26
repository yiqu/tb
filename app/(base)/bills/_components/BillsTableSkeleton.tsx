import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';

export default function BillsTableSkeleton() {
  return (
    <DisplayCard className="h-[calc(100dvh-20rem)] w-full">
      <CardContent className="h-full w-full">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </DisplayCard>
  );
}
