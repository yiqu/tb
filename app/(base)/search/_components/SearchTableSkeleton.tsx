import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';

export default function SearchTableSkeleton() {
  return (
    <DisplayCard className="w-full">
      <CardContent>
        <Skeleton className="h-[20rem] w-full" />
      </CardContent>
    </DisplayCard>
  );
}
