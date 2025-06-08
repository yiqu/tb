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
  pageId: string;
  sortDirection: string;
  sortField: string;
};
