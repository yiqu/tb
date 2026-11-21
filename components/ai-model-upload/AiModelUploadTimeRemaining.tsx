'use client';

import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

import { formatAiModelUploadTimeRemaining, getAiModelUploadSecondsRemaining } from './ai-model-upload.utils';

import type { AiModelUploadItem } from './ai-model-upload.models';

interface AiModelUploadTimeRemainingProps {
  upload: AiModelUploadItem;
  className?: string;
}

/** How often the estimate counts down between two progress reports. */
const TICK_MS = 1000;

/**
 * "About 3 min 20 sec left" for a running upload: the bytes still to send divided by the smoothed
 * upload speed, counting down every second between chunk confirmations. Display only.
 */
export default function AiModelUploadTimeRemaining({ upload, className }: AiModelUploadTimeRemainingProps) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(intervalId);
  }, []);

  // a new progress report is newer than the last tick, count from whichever is later
  const secondsRemaining: number | null = getAiModelUploadSecondsRemaining(upload, Math.max(now, upload.progressUpdatedAt ?? 0));

  return (
    <Typography variant="caption0" role="status" aria-live="off" className={ cn('tabular-nums', className) }>
      { formatAiModelUploadTimeRemaining(secondsRemaining) }
    </Typography>
  );
}
