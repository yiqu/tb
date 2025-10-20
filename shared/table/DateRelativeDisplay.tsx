'use client';

import { cn } from '@/lib/utils';
import useIsClient from '@/hooks/useIsClient';
import { isNumeric } from '@/lib/number.utils';
import useDuration2 from '@/hooks/useDuration2';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateRelativeDisplay({
  time,
  includeParenthesis = false,
  prefixText = '',
  postFixText = '',
  addSuffix = true,
  className = '',
  updateInterval = 15_000,
  largest = 3,
  useShortText = false,
  clientLoadingClassName = 'h-5 w-[50%]',
  showClientLoading,
}: {
  time: Date | string | null;
  includeParenthesis?: boolean;
  prefixText?: string;
  postFixText?: string;
  addSuffix?: boolean;
  className?: string;
  updateInterval?: number;
  largest?: number;
  useShortText?: boolean;
  clientLoadingClassName?: string;
  showClientLoading?: boolean;
}) {
  const isClient = useIsClient();

  // Convert time to timestamp (milliseconds)
  const timestamp =
    !time ? 0
    : time === '0' ? 0
    : time instanceof Date ? time.getTime()
    : isNumeric(time) ? Number.parseInt(time)
    : new Date(time).getTime();

  const relativeTime = useDuration2(timestamp, updateInterval, largest, useShortText);

  if (showClientLoading !== false && !isClient) {
    return <Skeleton className={ cn('h-5 w-[50%]', clientLoadingClassName) } />;
  }

  if (!relativeTime) {
    return <Typography>N/A</Typography>;
  }

  // Remove " ago" suffix or "in " prefix if addSuffix is false
  const relativeDate = addSuffix ? relativeTime : relativeTime.replace(/ ago$/, '').replace(/^in /, '');

  return (
    <Typography className={ cn(className) }>
      { includeParenthesis ?
        `(${prefixText ? `${prefixText} ` : ''}${relativeDate}${postFixText ? ` ${postFixText}` : ''})`
      : `${prefixText ? `${prefixText} ` : ''}${relativeDate}${postFixText ? ` ${postFixText}` : ''}` }
    </Typography>
  );
}
