/* eslint-disable react/no-array-index-key */
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';

const SKELETON_ROW_COUNT = 15;

export default function BillsTableSkeleton() {
  return (
    <DisplayCard className="h-[calc(100dvh-20rem)] w-full py-0">
      <div className={ `
        rounded-tl-md rounded-tr-md bg-sidebar-accent/70
        dark:bg-sidebar-accent/100
      ` }>
        <div className="overflow-hidden rounded-md">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <CardContent className="h-full w-full overflow-hidden">
        <div className="flex flex-col gap-y-3">
          { Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            <div key={ index } className={ `` }>
              <Skeleton className="h-10 w-full" />
            </div>
          )) }
        </div>
      </CardContent>
    </DisplayCard>
  );
}
