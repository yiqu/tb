'use client';

import { DateTime } from 'luxon';
import { CircleCheck } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

export default function DateClient({ date }: { date: number }) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <Skeleton className="h-6 w-[50%]" />;
  }

  const dateDisplay = DateTime.fromMillis(date);

  return (
    <div className="w-full">
      <DisplayCard className="w-full">
        <CardHeader>
          <CardTitle>Client Display</CardTitle>
          <CardDescription>Display the date in different time zones</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography>Local display: { dateDisplay.toString() } (my browser time)</Typography>
          <Typography className="flex flex-row items-center gap-x-1">
            UTC display: { dateDisplay.setZone('UTC').toString() } <CircleCheck className="size-4 text-green-500" />
          </Typography>
          <Typography>EST display: { dateDisplay.setZone('America/New_York').toString() } (manually converted with setZone)</Typography>
          <Typography>PST display: { dateDisplay.setZone('America/Los_Angeles').toString() } (manually converted with setZone)</Typography>
        </CardContent>
      </DisplayCard>
    </div>
  );
}
