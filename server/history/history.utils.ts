import { HistoryEntryGroup } from '@/models/history/history-entry.model';

export function createInitialHistoryEntryGroups(): HistoryEntryGroup[] {
  return [
    {
      dateLabel: 'Today',
      dateRangeEpoch: '',
      historyEntries: [],
    },
    {
      dateLabel: 'Yesterday',
      dateRangeEpoch: '',
      historyEntries: [],
    },
    {
      dateLabel: 'Last 7 Days',
      dateRangeEpoch: '',
      historyEntries: [],
    },
    {
      dateLabel: 'Last 30 Days',
      dateRangeEpoch: '',
      historyEntries: [],
    },
    {
      dateLabel: 'Older',
      dateRangeEpoch: '',
      historyEntries: [],
    },
  ];
}
