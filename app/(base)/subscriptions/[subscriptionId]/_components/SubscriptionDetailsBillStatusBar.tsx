import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/custom/tooltip';
import { SubscriptionDetailsStatsStatusBreakdown } from '@/models/subscriptions/subscription-details-stats.model';

export interface BillStatusBarSegment {
  id: keyof SubscriptionDetailsStatsStatusBreakdown;
  label: string;
  color: string;
}

interface Props {
  segments: BillStatusBarSegment[];
  statusBreakdown: SubscriptionDetailsStatsStatusBreakdown;
  totalCount: number;
  formatShare: (_count: number, _totalCount: number) => string;
}

/** Stacked bar of the bill statuses, sized by bill count. Hover it for what it shows. */
export default function SubscriptionDetailsBillStatusBar({ segments, statusBreakdown, totalCount, formatShare }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex h-3 w-full cursor-help flex-row gap-x-0.5 overflow-hidden rounded-full" aria-label="Bill status bar">
          { segments
            .filter((segment) => statusBreakdown[segment.id] > 0)
            .map((segment) => (
              <div
                key={ segment.id }
                className="h-full min-w-1"
                style={ { backgroundColor: segment.color, flexGrow: statusBreakdown[segment.id], flexBasis: 0 } }
              />
            )) }
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-80">
        <ColumnStack className="gap-y-1.5 py-1">
          <Typography variant="body0" className="font-semibold">
            { `How all ${totalCount} ${totalCount === 1 ? 'bill is' : 'bills are'} split by status` }
          </Typography>
          <Typography variant="body0">
            Each colored part is one status, and its width is that status&apos;s share of the bill count (not the cost). Every bill is in exactly one
            status, so the parts add up to 100%.
          </Typography>
          <ColumnStack className="gap-y-0.5">
            { segments.map((segment) => (
              <div key={ segment.id } className="flex flex-row items-center gap-x-2">
                <span className="size-2.5 shrink-0 rounded-full" style={ { backgroundColor: segment.color } } />
                <Typography variant="body0" className="grow">
                  { segment.label }
                </Typography>
                <Typography variant="body0" className="tabular-nums">
                  { `${statusBreakdown[segment.id]} (${formatShare(statusBreakdown[segment.id], totalCount)})` }
                </Typography>
              </div>
            )) }
          </ColumnStack>
        </ColumnStack>
      </TooltipContent>
    </Tooltip>
  );
}
