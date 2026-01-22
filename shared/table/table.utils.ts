export type SearchTableColumn = {
  headerId: string;
  ordinal: number;
  sortable?: boolean;
};

export const SEARCH_TABLE_COLUMN_IDS: SearchTableColumn[] = [
  { headerId: 'cost', ordinal: 0, sortable: true },
  { headerId: 'frequency', ordinal: 0.5, sortable: true },
  // { headerId: 'id', ordinal: 7 },
  { headerId: 'dateAdded', ordinal: 5, sortable: true },
  { headerId: 'dueDate', ordinal: 2, sortable: true },
  { headerId: 'paid', ordinal: 3, sortable: true },
  { headerId: 'reimbursed', ordinal: 4, sortable: true },
  { headerId: 'subscription', ordinal: 1, sortable: true },
  { headerId: 'updatedAt', ordinal: 6, sortable: true },
  { headerId: 'actions', ordinal: 8, sortable: false },
];

export const SUBSCRIPTIONS_TABLE_COLUMN_IDS: SearchTableColumn[] = [
  { headerId: 'name', ordinal: 0, sortable: true },
  { headerId: 'billCycleDuration', ordinal: 1, sortable: true },
  { headerId: 'description', ordinal: 2, sortable: true },
  { headerId: 'url', ordinal: 3, sortable: true },
  { headerId: 'cost', ordinal: 4, sortable: true },
  { headerId: 'billDuesCurrentYearCount', ordinal: 5, sortable: true },
  { headerId: 'billDuesCurrentYearTotalCost', ordinal: 6, sortable: true },
  { headerId: 'totalBillsAllTimeCount', ordinal: 7, sortable: true },
  { headerId: 'totalBillsAllTimeTotalCost', ordinal: 8, sortable: true },
  { headerId: 'approved', ordinal: 9, sortable: true },
  { headerId: 'signed', ordinal: 10, sortable: true },
  { headerId: 'dateAdded', ordinal: 11, sortable: true },
  { headerId: 'updatedAt', ordinal: 12, sortable: true },
  { headerId: 'actions', ordinal: 13, sortable: false },
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
  cost: '6rem',
  frequency: '7rem',
  dueDate: '16rem',
  subscription: '20rem',
  updatedAt: '8rem',
  actions: '7rem',
  dateAdded: '8rem',
  paid: '5rem',
  reimbursed: '7rem',
  name: '12rem',
  description: '11rem',
  url: '7rem',
  billCycleDuration: '7rem',
  approved: '5rem',
  signed: '5rem',
  billDuesCurrentYearCount: '7rem',
  billDuesCurrentYearTotalCost: '6rem',
  totalBillsAllTimeCount: '4rem',
  totalBillsAllTimeTotalCost: '6rem',
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
  name: 'Name',
  description: 'Description',
  url: 'URL',
  billCycleDuration: 'Frequency',
  approved: 'Approved',
  signed: 'Signed',
  billDuesCurrentYearCount: 'Current Year Bills Reimbursed / Total',
  billDuesCurrentYearTotalCost: 'Current Year Total Balance',
  totalBillsAllTimeCount: 'Total Bills All Time Count',
  totalBillsAllTimeTotalCost: 'Total Bills All Time Balance',
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

export function getSubscriptionLogoUrl(subscriptionName: string) {
  let logoLightUrl = 'renewal';
  let logoDarkUrl = 'renewal';
  const name = subscriptionName.trim();

  switch (name) {
    case 'GitHub Copilot': {
      logoLightUrl = 'githubcopilot_light';
      logoDarkUrl = 'githubcopilot_dark';
      break;
    }

    case 'GitHub Pro': {
      logoLightUrl = 'github_light';
      logoDarkUrl = 'github_dark';
      break;
    }

    case 'UI dot dev': {
      logoLightUrl = 'uidotdev';
      logoDarkUrl = 'uidotdev';
      break;
    }

    case 'Vercel Pro': {
      logoLightUrl = 'vercel_light';
      logoDarkUrl = 'vercel_dark';
      break;
    }

    case 'MUI Minimal Dashboard': {
      logoLightUrl = 'mui';
      logoDarkUrl = 'mui';
      break;
    }

    case 'MonaLisa Typeface': {
      logoLightUrl = 'mona-lisa';
      logoDarkUrl = 'mona-lisa';
      break;
    }

    case 'Flaticon Pro': {
      logoLightUrl = 'flaticon';
      logoDarkUrl = 'flaticon';
      break;
    }

    case 'Loading io': {
      logoLightUrl = 'loading';
      logoDarkUrl = 'loading';
      break;
    }

    case 'Pro Nextjs By Jack Harrington': {
      logoLightUrl = 'blackboard';
      logoDarkUrl = 'blackboard';
      break;
    }

    case 'Cursor IDE Pro': {
      logoLightUrl = 'cursor_light';
      logoDarkUrl = 'cursor_dark';
      break;
    }

    case 'ByteGrad': {
      logoLightUrl = 'blackboard';
      logoDarkUrl = 'blackboard';
      break;
    }

    case 'ChatGPT Plus': {
      logoLightUrl = 'openai_light';
      logoDarkUrl = 'openai_dark';
      break;
    }

    case 'MUI X Pro License': {
      logoLightUrl = 'mui';
      logoDarkUrl = 'mui';
      break;
    }

    case 'Medium': {
      logoLightUrl = 'medium';
      logoDarkUrl = 'medium';
      break;
    }

    case 'Microsoft 365': {
      logoLightUrl = 'microsoft';
      logoDarkUrl = 'microsoft';
      break;
    }

    case 'T3 Chat': {
      logoLightUrl = 'chat_t3';
      logoDarkUrl = 'chat_t3';
      break;
    }

    case 'Vercel v0': {
      logoLightUrl = 'v0_light';
      logoDarkUrl = 'v0_dark';
      break;
    }

    case 'CompTIA Security Plus': {
      logoLightUrl = 'shield';
      logoDarkUrl = 'shield';
      break;
    }

    case 'MongoDB Atlas Flex': {
      logoLightUrl = 'mongodb';
      logoDarkUrl = 'mongodb';
      break;
    }

    case 'Education to Training Hours': {
      logoLightUrl = 'edu';
      logoDarkUrl = 'edu';
      break;
    }

    case 'Claude AI Pro': {
      logoLightUrl = 'claude-light';
      logoDarkUrl = 'claude-dark';
      break;
    }
  }

  return {
    light: `/subs/${logoLightUrl}.png`,
    dark: `/subs/${logoDarkUrl}.png`,
  };
}

export function getSubscriptionLogoSize(subscriptionName: string) {
  const name = subscriptionName.trim();
  switch (name) {
    case 'MongoDB Atlas Flex': {
      return 10;
    }
    default: {
      return 20;
    }
  }
}

export function getSubscriptionDetailsHeaderLogoSize(subscriptionName: string) {
  const name = subscriptionName.trim();
  switch (name) {
    case 'MongoDB Atlas Flex': {
      return 15;
    }
    default: {
      return 30;
    }
  }
}

export function getSubscriptionDetailsTiltCardLogoSize(subscriptionName: string) {
  const name = subscriptionName.trim();
  switch (name) {
    case 'MongoDB Atlas Flex': {
      return 300;
    }
    default: {
      return 250;
    }
  }
}
