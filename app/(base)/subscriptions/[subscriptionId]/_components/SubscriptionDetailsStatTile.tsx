import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

interface SubscriptionDetailsStatTileProps {
  label: string;
  /** Small qualifier shown beside the label, such as the month or the year. */
  qualifier?: string;
  value: string;
  footer: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function SubscriptionDetailsStatTile({ label, qualifier, value, footer, icon, className }: SubscriptionDetailsStatTileProps) {
  return (
    <DisplayCard className={ cn('py-4', className) }>
      <CardContent className="px-4">
        <ColumnStack className="gap-y-1">
          <div className="flex flex-row items-center justify-between gap-x-2">
            <div className="flex min-w-0 flex-row items-baseline gap-x-1.5">
              <Typography variant="label1" className="truncate font-semibold">
                { label }
              </Typography>
              { qualifier ?
                <Typography variant="caption1" className="shrink-0">
                  { qualifier }
                </Typography>
              : null }
            </div>
            { icon ?
              <div className="shrink-0 text-muted-foreground">{ icon }</div>
            : null }
          </div>
          <Typography variant="h3" as="p" className="truncate tabular-nums">
            { value }
          </Typography>
          <div className="min-h-9">{ footer }</div>
        </ColumnStack>
      </CardContent>
    </DisplayCard>
  );
}
