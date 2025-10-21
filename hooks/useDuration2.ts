'use client';

import { useState, useEffect } from 'react';
import humanizeDuration from 'humanize-duration';

const ONE_MINUTE_MILLI = 1_000 * 60;

// Create a custom short English language
const shortEnglish = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'm',
      w: () => 'w',
      d: () => 'd',
      h: () => 'hr',
      m: () => 'min',
      s: () => 's',
    },
  },
});

export default function useDuration2(from: number, updateInterval: number = 30_000, largest: number = 2, useShortText: boolean = false) {
  const [elapsed, setElapsed] = useState<number>(() => Date.now() - from);

  useEffect(() => {
    // Initial update
    setElapsed(Date.now() - from);

    // Set up interval for periodic updates
    const timer = setInterval(() => {
      setElapsed(Date.now() - from);
    }, updateInterval);

    return () => {
      clearInterval(timer);
    };
  }, [from, updateInterval]);

  // Don't show if no valid from time
  if (!from || from === 0) {
    return null;
  }

  const isFuture = elapsed < 0;
  const absoluteElapsed = Math.abs(elapsed);

  // Handle very recent times
  if (absoluteElapsed < ONE_MINUTE_MILLI) {
    if (useShortText) {
      return isFuture ? 'in <1 min' : '<1 min ago';
    }
    return isFuture ? 'in less than a minute' : 'less than a minute ago';
  }

  // Format the duration using humanizeDuration
  const duration = useShortText
    ? shortEnglish(absoluteElapsed, {
        largest,
        units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
        round: true,
        spacer: '',
        delimiter: ' ',
      })
    : humanizeDuration(absoluteElapsed, {
        largest,
        units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
        round: true,
      });

  return isFuture ? `in ${duration}` : `${duration} ago`;
}
