'use client';

import useHistoryTracker from '@/hooks/useHistoryTracker';

export default function HistoryTrackerWrapper() {
  useHistoryTracker();
  return null;
}
