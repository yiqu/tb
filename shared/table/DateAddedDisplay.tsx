'use client';

import { formatDistanceToNow } from 'date-fns';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui-pre-19/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateAddedDisplay({ timeStamp }: { timeStamp: string | null }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-4 w-full" />;
  }

  if (!timeStamp) {
    return <Typography>N/A</Typography>;
  }

  const relativeDate = formatDistanceToNow(timeStamp, { addSuffix: true });

  return <Typography>{ relativeDate }</Typography>;
}
