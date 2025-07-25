'use client';

import { DateTime } from 'luxon';
import { format } from 'date-fns';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import Typography from '@/components/typography/Typography';

export default function DateDisplay({
  date,
  dateFormat = 'MM/dd/yyyy hh:mm a',
  isIso = false,
}: {
  date: Date | string | null;
  dateFormat?: string;
  isIso?: boolean;
}) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-6 w-[50%]" />;
  }

  if (!date) {
    return <Typography>N/A</Typography>;
  }

  const dateDisplay =
    isIso ?
      DateTime.fromJSDate(new Date(date as unknown as string))
        .setZone(EST_TIME_ZONE)
        .toLocaleString(DateTime.DATETIME_MED)
    : format(date instanceof Date ? date : new Date(Number.parseInt(date)), dateFormat);

  return <Typography className="truncate">{ dateDisplay }</Typography>;
}
