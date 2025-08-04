import { SORT_DATA_PAGE_IDS } from '@/constants/constants';

export type SortDataModel = {
  id: string;
  pageId: string;
  sortDirection: string;
  sortField: string;
  dateAdded: Date;
  updatedAt: Date | null;
};

export type SortDataAddable = Omit<SortDataModel, 'id' | 'dateAdded' | 'updatedAt'>;
export type SortDataEditable = Omit<SortDataModel, 'dateAdded' | 'updatedAt'>;
export type SortDataUpsertable = {
  id?: string;
  pageId: SortDataPageId;
  sortDirection: string;
  sortField: string;
};

export type SortDataPageId = (typeof SORT_DATA_PAGE_IDS)[keyof typeof SORT_DATA_PAGE_IDS];
