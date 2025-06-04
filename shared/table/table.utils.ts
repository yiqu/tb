export type SearchTableColumn = {
  headerId: string;
  ordinal: number;
};

export const SEARCH_TABLE_COLUMN_IDS: SearchTableColumn[] = [
  { headerId: 'id', ordinal: 0 },
  { headerId: 'dateAdded', ordinal: 1 },
  { headerId: 'dueDate', ordinal: 2 },
  { headerId: 'paid', ordinal: 3 },
  { headerId: 'reimbursed', ordinal: 4 },
  { headerId: 'subscription', ordinal: 5 },
  { headerId: 'updatedAt', ordinal: 6 },
];

export const getSearchTableColumnWidth = (columnId: string): string | undefined => {
  switch (columnId) {
    case 'id':
      return '10rem';
    default:
      return;
  }
};

export function getSearchTableColumns() {}
