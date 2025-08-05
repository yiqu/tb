'use client';

import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateRelativeDisplay({
  time,
  includeParenthesis = false,
  prefixText = '',
  postFixText = '',
  addSuffix = true,
  className = '',
}: {
  time: Date | string | null;
  includeParenthesis?: boolean;
  prefixText?: string;
  postFixText?: string;
  addSuffix?: boolean;
  className?: string;
}) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-6 w-[50%]" />;
  }

  if (time === '0' || Number.parseInt(time as string) === 0) {
    return <Skeleton className="h-6 w-[50%]" />;
  }

  if (!time) {
    return <Typography>N/A</Typography>;
  }

  const relativeDate = formatDistanceToNow(time instanceof Date ? time : new Date(Number.parseInt(time)), { addSuffix: addSuffix });

  return (
    <Typography className={ cn(className) }>
      { includeParenthesis ?
        `(${prefixText ? `${prefixText} ` : ''}${relativeDate}${postFixText ? ` ${postFixText}` : ''})`
      : `${prefixText ? `${prefixText} ` : ''}${relativeDate}${postFixText ? ` ${postFixText}` : ''}` }
    </Typography>
  );
}
