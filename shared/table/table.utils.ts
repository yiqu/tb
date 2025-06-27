export type SearchTableColumn = {
  headerId: string;
  ordinal: number;
};

export const SEARCH_TABLE_COLUMN_IDS: SearchTableColumn[] = [
  { headerId: 'cost', ordinal: 0 },
  { headerId: 'frequency', ordinal: 0.5 },
  // { headerId: 'id', ordinal: 7 },
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
  id: '4rem',
  cost: '11rem',
  frequency: '7rem',
  dueDate: '14rem',
  subscription: '20rem',
  updatedAt: '10rem',
  actions: '7rem',
  dateAdded: '10rem',
  paid: '5rem',
  reimbursed: '7rem',
};

export const SEARCH_TABLE_COLUMN_TEXT = {
  cost: 'Cost',
  id: 'ID',
  frequency: 'Frequency',
  dateAdded: 'Date Added',
  dueDate: 'Due Date',
  paid: 'Paid',
  reimbursed: 'Reimbursed',
  subscription: 'Subscription',
  updatedAt: 'Updated At',
  actions: 'Actions',
};

export type SortDirection = 'asc' | 'desc' | '';
export type SortField = 'id' | 'dateAdded' | 'dueDate' | 'paid' | 'reimbursed' | 'subscription' | 'updatedAt' | 'frequency' | '';
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

export function getFrequencyImageUrl(frequency: string): string {
  switch (frequency) {
    case 'monthly':
      return '/frequency/month.png';
    case 'yearly':
      return '/frequency/year.png';
    case 'once': {
      return '/frequency/once.png';
    }
    default: {
      return '';
    }
  }
}
