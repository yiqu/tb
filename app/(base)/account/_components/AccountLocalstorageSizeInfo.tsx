/* eslint-disable readable-tailwind/multiline */
'use client';

import { useTheme } from 'next-themes';

import useIsClient from '@/hooks/useIsClient';
import { manageLocalStorage } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getPercentFormatter } from '@/lib/number.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import { Particles } from '@/components/magicui/particles';
import Typography from '@/components/typography/Typography';
import ScrambleHover from '@/fancy/components/text/scramble-hover';
const percentFormatter = getPercentFormatter(2, 2);

export default function AccountLocalstorageSizeInfo() {
  const isClient = useIsClient();
  const { theme } = useTheme();

  if (!isClient) {
    return (
      <DisplayCard className="relative h-[141px] overflow-hidden p-4">
        <section className="flex flex-row items-center justify-between">
          <Typography variant="body0" className="font-semibold">
            Local Storage Usage
          </Typography>
        </section>
        <section>
          <Skeleton className="h-15 w-[212px]" />
        </section>
      </DisplayCard>
    );
  }

  const storageInfo = manageLocalStorage();

  return (
    <DisplayCard className="relative overflow-hidden p-4">
      <Particles
        className="absolute inset-0 z-0 h-full w-full"
        quantity={ 19 }
        ease={ 80 }
        color={ theme === 'dark' ? '#f6833c' : '#7b3306' }
        refresh={ false }
        staticity={ 40 }
        size={ 0.4 }
      />
      <section className="flex flex-row items-center justify-between">
        <Typography variant="body0" className="font-semibold">
          <ScrambleHover
            text={ 'Local Storage Usage' }
            scrambleSpeed={ 50 }
            maxIterations={ 8 }
            useOriginalCharsOnly={ true }
            className=""
          />
        </Typography>
      </section>
      <section className={ `flex w-full flex-col items-start justify-start gap-y-2` }>
        <section className="flex w-full flex-row items-center justify-end">
          <Typography variant="body0">{ storageInfo.totalSize } / 5MB</Typography>
        </section>
        <Progress value={ storageInfo.percentNumber } className="w-full" />
        <section>
          <Typography variant="body0">{ percentFormatter.format(storageInfo.percentNumber) } used</Typography>
        </section>
      </section>
    </DisplayCard>
  );
}
