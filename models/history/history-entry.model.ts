export type HistoryEntry = {
  id: string;
  name: string | null;
  url: string;
  dateAdded: Date;
  updatedAt: Date | null;
};

export type HistoryEntryGroup = {
  dateLabel: string;
  dateRangeEpoch: string;
  historyEntries: HistoryEntry[];
};

export const SORTING_ORDER_HISTORY_ENTRIES = {
  Today: 0,
  Yesterday: 1,
  'Last 7 Days': 2,
  'Last 30 Days': 3,
  Older: 4,
} as const;

export type HistoryEntryResponse = {
  groups: HistoryEntryGroup[];
  totalCount: number;
}