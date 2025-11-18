import { SquareArrowDown } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardAction, CardHeader, CardDescription } from '@/components/ui/card';

type Props = {
  cardTitle: string;
};

export default function CardLoading({ cardTitle }: Props) {
  return (
    <DisplayCard className="@container/card">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowDown className="size-5" />
            <Typography>{ cardTitle }</Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>
          <Skeleton className="h-8 w-full" />
        </CardTitle>
        <CardAction>
          <Skeleton className="h-6 w-18" />
        </CardAction>
      </CardHeader>
    </DisplayCard>
  );
}
