import { DateTime } from 'luxon';
import { connection } from 'next/server';
import { formatDistanceToNow } from 'date-fns';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import Typography from '@/components/typography/Typography';
import { CopyButton } from '@/components/animate-ui/buttons/copy';

export default async function DateDialogContent({ dateString, isIso = false }: { dateString: string; isIso?: boolean }) {
  await connection();
  const dateDisplay =
    isIso ?
      DateTime.fromJSDate(new Date(dateString)).setZone(EST_TIME_ZONE).toLocaleString(DateTime.DATETIME_MED)
    : DateTime.fromMillis(Number.parseInt(dateString)).setZone(EST_TIME_ZONE).toLocaleString(DateTime.DATETIME_MED);

  const relativeDate = formatDistanceToNow(isIso ? new Date(dateString) : new Date(Number.parseInt(dateString)), { addSuffix: true });

  return (
    <div className="flex flex-col items-start justify-start">
      <div className="grid gap-2">
        <div className="grid grid-cols-3 items-center gap-4">
          <Typography>Date</Typography>
          <div className="col-span-2">
            <Typography>{ dateDisplay }</Typography>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Typography>Relative</Typography>
          <div className="col-span-2">
            <Typography>{ relativeDate }</Typography>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Typography>Epoch</Typography>
          <div className="col-span-2 flex flex-row items-center gap-x-2">
            <Typography>{ dateString }</Typography>
            <CopyButton content={ dateString } size="sm" variant="ghost" />
          </div>
        </div>
      </div>
    </div>
  );
}
