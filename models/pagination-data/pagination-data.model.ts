export type PaginationDataModel = {
  id: string;
  pageId: string;
  pageNumber: number;
  pageSize: number;
  dateAdded: Date;
  updatedAt: Date | null;
};

export type PaginationDataAddable = Omit<PaginationDataModel, 'id' | 'dateAdded' | 'updatedAt'>;

export type PaginationDataEditable = Omit<PaginationDataModel, 'dateAdded' | 'updatedAt'>;

export type PaginationDataUpsertable = {
  id?: string;
  pageId: string;
  pageSize: number;
};
