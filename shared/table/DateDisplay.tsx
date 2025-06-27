'use client';

import { format } from 'date-fns';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';

export default function DateDisplay({ date, dateFormat = 'MM/dd/yyyy hh:mm a' }: { date: Date | string | null; dateFormat?: string }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-6 w-[50%]" />;
  }

  if (!date) {
    return <Typography>N/A</Typography>;
  }

  const dateDisplay = format(date instanceof Date ? date : new Date(Number.parseInt(date)), dateFormat);

  return <Typography className="truncate">{ dateDisplay }</Typography>;
}
