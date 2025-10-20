'use client';

import { DateTime } from 'luxon';

import { cn } from '@/lib/utils';
import useIsClient from '@/hooks/useIsClient';
import { isNumeric } from '@/lib/number.utils';
import useDuration2 from '@/hooks/useDuration2';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

const DAY_THRESHOLD_TO_SHOW_SECONDS = 3;
const SHOW_SECONDS_IF_PAST_DUE_DATE = false;

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
  overrideHideSeconds,
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
  overrideHideSeconds?: boolean;
}) {
  const isClient = useIsClient();

  let largestValue = largest;
  let updateIntervalValue = updateInterval;

  // Convert time to timestamp (milliseconds)
  const timestamp =
    !time ? 0
    : time === '0' ? 0
    : time instanceof Date ? time.getTime()
    : isNumeric(time) ? Number.parseInt(time)
    : new Date(time).getTime();

  const showSecondsDueToPastDueDate: boolean = SHOW_SECONDS_IF_PAST_DUE_DATE && DateTime.fromMillis(timestamp).diffNow().as('days') < 0;

  // if the time range is within 3 days, show seconds too, so largest is 4
  const timeRange = DateTime.fromMillis(timestamp).diffNow().as('days');

  if (!overrideHideSeconds && (timeRange < DAY_THRESHOLD_TO_SHOW_SECONDS || showSecondsDueToPastDueDate)) {
    largestValue = 4;
    updateIntervalValue = 1_000;
  }
  const relativeTime = useDuration2(timestamp, updateIntervalValue, largestValue, useShortText);

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
