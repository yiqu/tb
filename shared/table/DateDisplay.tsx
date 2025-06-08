'use client';

import { format } from 'date-fns';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateDisplay({ date }: { date: Date | string | null }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-4 w-full" />;
  }

  if (!date) {
    return <Typography>N/A</Typography>;
  }

  const dateDisplay = format(date instanceof Date ? date : new Date(Number.parseInt(date)), 'MM/dd/yyyy hh:mm a');

  return <Typography>{ dateDisplay }</Typography>;
}
