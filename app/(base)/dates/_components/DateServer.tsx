/* eslint-disable no-console */
import { DateTime } from 'luxon';

import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

export default function DateServer({ date }: { date: number }) {
  const dateDisplay = DateTime.fromMillis(date);

  return (
    <div className="w-full">
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
    </div>
  );
}
