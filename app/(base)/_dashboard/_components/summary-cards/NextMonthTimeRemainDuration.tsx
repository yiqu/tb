'use client';

import { DateTime, Duration } from 'luxon';
import humanizeDuration from 'humanize-duration';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { useClientOnly } from '@/hooks/useClientOnly';
import WithTooltip from '@/shared/components/WithTooltip';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';

const WARNING_DURATION_MILLISECONDS: number = Duration.fromObject({ days: 4 }).toMillis();
const DANGER_DURATION_MILLISECONDS: number = Duration.fromObject({ days: 1 }).toMillis();

interface Props {
  selectedMonthYear: string | undefined;
  nextMonthData: BillDueWithSubscriptionByMonthAndYear;
}

export default function NextMonthTimeRemainDuration({ selectedMonthYear, nextMonthData }: Props) {
  const isClient = useClientOnly();

  if (!selectedMonthYear && nextMonthData.monthParams && nextMonthData.yearParams) {
    if (!isClient) {
      return <Skeleton className="h-5 w-[150px]" />;
    }

    const nextMonth = nextMonthData.monthParams;
    const nextYear = nextMonthData.yearParams;

    const nextMonthFirstDayLuxonMillisecond = DateTime.fromObject(
      {
        month: Number.parseInt(nextMonth),
        year: Number.parseInt(nextYear),
        day: 1,
      },
      {
        zone: EST_TIME_ZONE,
      },
    ).toMillis();

    const currentDateLuxonMillisecond = DateTime.now().setZone(EST_TIME_ZONE).toMillis();

    const duration = humanizeDuration(nextMonthFirstDayLuxonMillisecond - currentDateLuxonMillisecond, {
      largest: 5,
      round: true,
    });

    return (
      <WithTooltip tooltip={ duration }>
        <DateRelativeDisplay
          time={ `${nextMonthFirstDayLuxonMillisecond}` }
          addSuffix={ false }
          prefixText={ 'IN:' }
          className={ cn(`truncate font-semibold`, {
            'text-yellow-600': nextMonthFirstDayLuxonMillisecond - currentDateLuxonMillisecond < WARNING_DURATION_MILLISECONDS,
            'text-red-400': nextMonthFirstDayLuxonMillisecond - currentDateLuxonMillisecond < DANGER_DURATION_MILLISECONDS,
          }) }
          isCompleted={ false }
          largest={ 5 }
          updateInterval={ 1_000 }
          useShortTextJustSeconds={ true }
        />
      </WithTooltip>
    );
  }

  return null;
}

