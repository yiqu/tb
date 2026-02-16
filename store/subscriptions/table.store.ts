import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// export const SEARCH_TABLE_COLUMN_WIDTH = {
//   id: '4rem',
//   cost: '6rem',
//   frequency: '7rem',
//   dueDate: '16rem',
//   subscription: '20rem',
//   updatedAt: '8rem',
//   actions: '7rem',
//   dateAdded: '8rem',
//   paid: '5rem',
//   reimbursed: '7rem',
//   name: '12rem',
//   description: '11rem',
//   url: '7rem',
//   billCycleDuration: '7rem',
//   approved: '5rem',
//   signed: '5rem',
//   billDuesCurrentYearCount: '7rem',
//   billDuesCurrentYearTotalCost: '6rem',
//   totalBillsAllTimeCount: '4rem',
//   totalBillsAllTimeTotalCost: '6rem',
// };

// export const SUBSCRIPTIONS_TABLE_COLUMN_IDS: SearchTableColumn[] = [
//   { headerId: 'name', ordinal: 0, sortable: true },
//   { headerId: 'billCycleDuration', ordinal: 1, sortable: true },
//   { headerId: 'description', ordinal: 2, sortable: true },
//   { headerId: 'url', ordinal: 3, sortable: true },
//   { headerId: 'cost', ordinal: 4, sortable: true },
//   { headerId: 'billDuesCurrentYearCount', ordinal: 5, sortable: true },
//   { headerId: 'billDuesCurrentYearTotalCost', ordinal: 6, sortable: true },
//   { headerId: 'totalBillsAllTimeCount', ordinal: 7, sortable: true },
//   { headerId: 'totalBillsAllTimeTotalCost', ordinal: 8, sortable: true },
//   { headerId: 'approved', ordinal: 9, sortable: true },
//   { headerId: 'signed', ordinal: 10, sortable: true },
//   { headerId: 'dateAdded', ordinal: 11, sortable: true },
//   { headerId: 'updatedAt', ordinal: 12, sortable: true },
//   { headerId: 'actions', ordinal: 13, sortable: false },
// ];

// export const SEARCH_TABLE_COLUMN_IDS: SearchTableColumn[] = [
//   { headerId: 'cost', ordinal: 0, sortable: true },
//   { headerId: 'frequency', ordinal: 0.5, sortable: true },
//   // { headerId: 'id', ordinal: 7 },
//   { headerId: 'dateAdded', ordinal: 5, sortable: true },
//   { headerId: 'dueDate', ordinal: 2, sortable: true },
//   { headerId: 'paid', ordinal: 3, sortable: true },
//   { headerId: 'reimbursed', ordinal: 4, sortable: true },
//   { headerId: 'subscription', ordinal: 1, sortable: true },
//   { headerId: 'updatedAt', ordinal: 6, sortable: true },
//   { headerId: 'actions', ordinal: 8, sortable: false },
// ];

export type TableId = 'subscriptions' | 'bills';

export const SUBSCRIPTIONS_TABLE_COLUMNS = [
  'name',
  'billCycleDuration',
  'description',
  'url',
  'cost',
  'billDuesCurrentYearCount',
  'billDuesCurrentYearTotalCost',
  'totalBillsAllTimeCount',
  'totalBillsAllTimeTotalCost',
  'approved',
  'signed',
  'dateAdded',
  'updatedAt',
  'tableActions',
];
export const BILLS_TABLE_COLUMNS = [
  'cost',
  'frequency',
  'dateAdded',
  'dueDate',
  'paid',
  'reimbursed',
  'subscription',
  'updatedAt',
  'tableActions',
];

export const unsortableSubscriptionsColumns: Record<string, boolean> = {
  tableActions: false,
};
export const unsortableBillsColumns: Record<string, boolean> = {
  tableActions: false,
};

type TableColumnsState = {
  frequency: number;
  dueDate: number;
  paid: number;
  reimbursed: number;
  subscription: number;

  name: number;
  billCycleDuration: number;
  description: number;
  url: number;
  cost: number;
  billDuesCurrentYearCount: number;
  billDuesCurrentYearTotalCost: number;
  totalBillsAllTimeCount: number;
  totalBillsAllTimeTotalCost: number;
  approved: number;
  signed: number;
  dateAdded: number;
  updatedAt: number;
  tableActions: number;

  subscriptionsTableColumnOrdinal: {
    name: number;
    billCycleDuration: number;
    description: number;
    url: number;
    cost: number;
    billDuesCurrentYearCount: number;
    billDuesCurrentYearTotalCost: number;
    totalBillsAllTimeCount: number;
    totalBillsAllTimeTotalCost: number;
    approved: number;
    signed: number;
    dateAdded: number;
    updatedAt: number;
    tableActions: number;
  };

  billsTableColumnOrdinal: {
    cost: number;
    frequency: number;
    subscription: number;
    dueDate: number;
    paid: number;
    reimbursed: number;
    dateAdded: number;
    updatedAt: number;
    tableActions: number;
  };

  actions: {
    setColumnWidth: (_column: string, _width: number) => void;
    reorderSubscriptionsColumns: (_ordinals: Partial<TableColumnsState['subscriptionsTableColumnOrdinal']>) => void;
    reorderBillsColumns: (_ordinals: Partial<TableColumnsState['billsTableColumnOrdinal']>) => void;
  };
};

const useTableColumnsStore = create<TableColumnsState>()(
  persist(
    (set) => ({
      frequency: 130, // 7rem
      dueDate: 180, // 7rem
      paid: 110, // 7rem
      reimbursed: 110, // 7rem
      subscription: 180, // 7rem

      name: 192, // 12rem
      billCycleDuration: 112, // 7rem
      description: 176, // 11rem
      url: 112, // 7rem
      cost: 96, // 6rem
      billDuesCurrentYearCount: 112, // 7rem
      billDuesCurrentYearTotalCost: 96, // 6rem
      totalBillsAllTimeCount: 64, // 4rem
      totalBillsAllTimeTotalCost: 96, // 6rem
      approved: 80, // 5rem
      signed: 80, // 5rem
      dateAdded: 128, // 8rem
      updatedAt: 128, // 8rem
      tableActions: 112, // 7rem (actions)

      subscriptionsTableColumnOrdinal: {
        approved: 9,
        billCycleDuration: 2,
        billDuesCurrentYearCount: 5,
        billDuesCurrentYearTotalCost: 6,
        cost: 4,
        dateAdded: 11,
        description: 1,
        name: 0,
        signed: 10,
        tableActions: 13,
        totalBillsAllTimeCount: 7,
        totalBillsAllTimeTotalCost: 8,
        updatedAt: 12,
        url: 3,
        actions: 13,
      },

      billsTableColumnOrdinal: {
        cost: 0,
        frequency: 1,
        subscription: 2,
        dueDate: 3,
        paid: 4,
        reimbursed: 5,
        dateAdded: 6,
        updatedAt: 7,
        tableActions: 8,
      },

      actions: {
        setColumnWidth: (column, width) => {
          set((_state) => ({
            [column]: width,
          }));
        },
        reorderSubscriptionsColumns: (ordinals) => {
          set((_state) => ({
            subscriptionsTableColumnOrdinal: {
              ..._state.subscriptionsTableColumnOrdinal,
              ...ordinals,
            },
          }));
        },
        reorderBillsColumns: (ordinals) => {
          set((_state) => ({
            billsTableColumnOrdinal: {
              ..._state.billsTableColumnOrdinal,
              ...ordinals,
            },
          }));
        },
      },
    }),
    {
      name: 'subscriptions-table-columns-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        frequency: state.frequency,
        dueDate: state.dueDate,
        paid: state.paid,
        reimbursed: state.reimbursed,
        subscription: state.subscription,

        name: state.name,
        billCycleDuration: state.billCycleDuration,
        description: state.description,
        url: state.url,
        cost: state.cost,
        billDuesCurrentYearCount: state.billDuesCurrentYearCount,
        billDuesCurrentYearTotalCost: state.billDuesCurrentYearTotalCost,
        totalBillsAllTimeCount: state.totalBillsAllTimeCount,
        totalBillsAllTimeTotalCost: state.totalBillsAllTimeTotalCost,
        approved: state.approved,
        signed: state.signed,
        dateAdded: state.dateAdded,
        updatedAt: state.updatedAt,

        subscriptionsTableColumnOrdinal: state.subscriptionsTableColumnOrdinal,
        billsTableColumnOrdinal: state.billsTableColumnOrdinal,
      }),
    },
  ),
);

export const useTableColumn = (column: string) =>
  useTableColumnsStore((state) => {
    return (state[column as keyof TableColumnsState] as number) ?? 120;
  });
export const useTableActionColumnWidth = () => useTableColumnsStore((state) => state.tableActions);

export const useTotalColumnsWidth = (tableId: TableId) =>
  useTableColumnsStore((state) => {
    // only add the values if they are a number
    if (tableId === 'subscriptions') {
      return SUBSCRIPTIONS_TABLE_COLUMNS.reduce((acc: number, curr: string) => acc + (state[curr as keyof TableColumnsState] as number), 0);
    } else if (tableId === 'bills') {
      return BILLS_TABLE_COLUMNS.reduce((acc: number, curr: string) => acc + (state[curr as keyof TableColumnsState] as number), 0);
    }
    return 0;
  });

export const useColumnOrdinalObject = (tableId: TableId) =>
  useTableColumnsStore((state) => {
    if (tableId === 'subscriptions') {
      return state.subscriptionsTableColumnOrdinal;
    } else if (tableId === 'bills') {
      return state.billsTableColumnOrdinal;
    }
    return {};
  });

export const useTableColumnsActions = () => useTableColumnsStore((state) => state.actions);

