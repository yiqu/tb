'use client';

import { formatDistanceToNow } from 'date-fns';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateRelativeDisplay({
  time,
  includeParenthesis = false,
}: {
  time: Date | string | null;
  includeParenthesis?: boolean;
}) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-6 w-full" />;
  }

  if (!time) {
    return <Typography>N/A</Typography>;
  }

  const relativeDate = formatDistanceToNow(time instanceof Date ? time : new Date(Number.parseInt(time)), { addSuffix: true });

  return <Typography>{ includeParenthesis ? `(${relativeDate})` : relativeDate }</Typography>;
}
