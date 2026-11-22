'use client';

import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

import { formatPwsModelUploadTimeRemaining, getPwsModelUploadSecondsRemaining } from '../utils/pws-model-upload.utils';

import type { PwsModelUploadItem } from '../models/pws-model-upload.models';

interface PwsModelUploadTimeRemainingProps {
  upload: PwsModelUploadItem;
  className?: string;
}

/** How often the estimate counts down between two progress reports. */
const TICK_MS = 1000;

/**
 * "About 3 min 20 sec left" for a running upload: the bytes still to send divided by the smoothed
 * upload speed, counting down every second between chunk confirmations. Display only.
 */
export default function PwsModelUploadTimeRemaining({ upload, className }: PwsModelUploadTimeRemainingProps) {
  const [now, setNow] = useState<number>(() => {
    return Date.now();
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, TICK_MS);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // a new progress report is newer than the last tick, count from whichever is later
  const secondsRemaining: number | null = getPwsModelUploadSecondsRemaining(upload, Math.max(now, upload.progressUpdatedAt ?? 0));

  return (
    <Typography variant="caption0" role="status" aria-live="off" className={ cn('tabular-nums', className) }>
      { formatPwsModelUploadTimeRemaining(secondsRemaining) }
    </Typography>
  );
}
