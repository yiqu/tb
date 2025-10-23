/* eslint-disable no-console */
import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

export default function DateServer({ date }: { date: number }) {
  const dateDisplay = DateTime.fromMillis(date);
  const dateDisplayZoned = DateTime.fromMillis(date, {
    zone: EST_TIME_ZONE,
  });

  return (
    <div className="flex w-full flex-col gap-y-10">
      <DisplayCard className="w-full">
        <CardHeader>
          <CardTitle>Server Display</CardTitle>
          <CardDescription>Display the date in different time zones</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography>Local display: { dateDisplay.toString() }</Typography>
          <Typography>UTC display: { dateDisplay.setZone('UTC').toString() }</Typography>
          <Typography>EST display: { dateDisplay.setZone('America/New_York').toString() }</Typography>
          <Typography>PST display: { dateDisplay.setZone('America/Los_Angeles').toString() } (manually converted with setZone)</Typography>
        </CardContent>
      </DisplayCard>

      <DisplayCard className="w-full">
        <CardHeader>
          <CardTitle>Server Display (Zoned)</CardTitle>
          <CardDescription>Display the date in different time zones</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <Typography>Local display (already zoned in EST_TIME_ZONE): { dateDisplayZoned.toString() }</Typography>
          <Typography>UTC display (setZone(UTC) called): { dateDisplayZoned.setZone('UTC').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) }</Typography>
          <Typography>EST display (setZone(EST_TIME_ZONE) called): { dateDisplayZoned.setZone(EST_TIME_ZONE).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) }</Typography>
          <Typography>
            PST display (setZone(PST) called): { dateDisplayZoned.setZone('America/Los_Angeles').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS) } (manually
            converted with setZone)
          </Typography>
        </CardContent>
      </DisplayCard>
    </div>
  );
}
