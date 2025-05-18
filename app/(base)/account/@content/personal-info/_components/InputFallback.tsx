import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function InputFallback() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-[37px] w-full rounded-lg" />
      <section className="flex items-center justify-end">
        <Button size="default" disabled>
          Loading
        </Button>
      </section>
    </div>
  );
}
