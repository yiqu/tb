/* eslint-disable react/no-array-index-key */
import omit from 'lodash/omit';

import { cn } from '@/lib/utils';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';

const SKELETON_ROW_COUNT = 15;

export default function BillsTableSkeleton({
  count = SKELETON_ROW_COUNT,
  className,
  ...props
}: { count?: number } & React.ComponentProps<'div'>) {
  return (
    <DisplayCard className={ cn('h-[calc(100dvh-20rem)] w-full py-0', className) } { ...omit(props, ['className']) }>
      <div className={ `
        rounded-tl-md rounded-tr-md bg-sidebar-accent/70
        dark:bg-sidebar-accent
      ` }>
        <div className="overflow-hidden rounded-md">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <CardContent className="h-full w-full overflow-hidden">
        <div className="flex flex-col gap-y-3">
          { Array.from({ length: count }).map((_, index) => (
            <div key={ index } className={ `` }>
              <Skeleton className="h-10 w-full" />
            </div>
          )) }
        </div>
      </CardContent>
    </DisplayCard>
  );
}
