export type SearchTableColumn = {
  headerId: string;
  ordinal: number;
};

export const SEARCH_TABLE_COLUMN_IDS: SearchTableColumn[] = [
  { headerId: 'cost', ordinal: 0 },
  { headerId: 'id', ordinal: 7 },
  { headerId: 'dateAdded', ordinal: 5 },
  { headerId: 'dueDate', ordinal: 2 },
  { headerId: 'paid', ordinal: 3 },
  { headerId: 'reimbursed', ordinal: 4 },
  { headerId: 'subscription', ordinal: 1 },
  { headerId: 'updatedAt', ordinal: 6 },
  { headerId: 'actions', ordinal: 8 },
];

export const getSearchTableColumnWidth = (columnId: string): string | undefined => {
  switch (columnId) {
    case 'id':
      return '10rem';
    default:
      return;
  }
};

export const SEARCH_TABLE_COLUMN_WIDTH = {
  id: '1rem',
  cost: '10rem',
  dueDate: '10rem',
  subscription: '20rem',
  updatedAt: '10rem',
  actions: '10rem',
  dateAdded: '10rem',
  paid: '10rem',
  reimbursed: '10rem',
};

export const SEARCH_TABLE_COLUMN_TEXT = {
  cost: 'Cost',
  id: 'ID',
  dateAdded: 'Date Added',
  dueDate: 'Due Date',
  paid: 'Paid',
  reimbursed: 'Reimbursed',
  subscription: 'Subscription',
  updatedAt: 'Updated At',
  actions: 'Actions',
};

export type SortDirection = 'asc' | 'desc' | '';
export type SortField = 'id' | 'dateAdded' | 'dueDate' | 'paid' | 'reimbursed' | 'subscription' | 'updatedAt' | '';
export type SortData = {
  sort: SortField;
  direction: SortDirection;
};

export function getNextSortDirection(currentSortData: SortData, nextSortField: SortField): SortData {
  const currentDirection = currentSortData.direction;
  let nextDirection: SortDirection = 'asc';
  if (currentSortData.sort === nextSortField) {
    if (currentDirection === 'asc') {
      nextDirection = 'desc';
    } else if (currentDirection === 'desc') {
      nextDirection = '';
    } else {
      nextDirection = 'asc';
    }
  } else {
    if (currentDirection === 'asc') {
      nextDirection = 'asc';
    } else if (currentDirection === 'desc') {
      nextDirection = 'desc';
    } else {
      nextDirection = 'asc';
    }
  }
  return {
    sort: nextDirection === '' ? '' : nextSortField,
    direction: nextDirection,
  };
}

export function getSearchTableColumns() {}
