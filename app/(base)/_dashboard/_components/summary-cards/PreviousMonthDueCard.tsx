import { TrendingUp, SquareArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { Card, CardTitle, CardAction, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';

export default function PreviousMonthDueCard() {
  return (
    <DisplayCard className="@container/card">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowLeft className="size-5" />
            <Typography>Last Month</Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>$1,250.00</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </DisplayCard>
  );
}
