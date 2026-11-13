import { Skeleton } from '@/components/ui/skeleton';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

export default function YearlyBillsMonthsSkeleton() {
  return (
    <ColumnStack className="w-full gap-y-8">
      <Skeleton className="h-7 w-[420px]" />
      { Array.from({ length: 3 }, (_, index: number) => (
        <ColumnStack key={ index } className="w-full gap-y-3">
          <RowStack className="w-full items-center justify-between">
            <RowStack className="items-center gap-x-3">
              <Skeleton className="size-11 rounded-md" />
              <Skeleton className="h-8 w-[140px]" />
            </RowStack>
            <RowStack className="gap-3">
              <Skeleton className="h-16 w-[150px]" />
              <Skeleton className="h-16 w-[150px]" />
              <Skeleton className="h-16 w-[150px]" />
            </RowStack>
          </RowStack>
          <Skeleton className="h-48 w-full" />
        </ColumnStack>
      )) }
    </ColumnStack>
  );
}
