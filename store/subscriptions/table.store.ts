import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
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

type TableColumnsState = {
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

  columnOrdinal: {
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

  actions: {
    setColumnWidth: (_column: string, _width: number) => void;
    updateColumnOrdinal: (_column: string, _ordinal: number) => void;
    reorderColumns: (_ordinals: Partial<TableColumnsState['columnOrdinal']>) => void;
  };
};

const useTableColumnsStore = create<TableColumnsState>()(
  persist(
    (set) => ({
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

      columnOrdinal: {
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

      actions: {
        setColumnWidth: (column, width) => {
          set((_state) => ({
            [column]: width,
          }));
        },
        updateColumnOrdinal: (column, ordinal) => {
          set((_state) => ({
            columnOrdinal: {
              ..._state.columnOrdinal,
              [column as keyof TableColumnsState['columnOrdinal']]: ordinal,
            },
          }));
        },
        reorderColumns: (ordinals) => {
          set((_state) => ({
            columnOrdinal: {
              ..._state.columnOrdinal,
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
        columnOrdinal: state.columnOrdinal,
      }),
    },
  ),
);

export const useTableColumn = (column: string) =>
  useTableColumnsStore((state) => (state[column as keyof TableColumnsState] as number) ?? 120);
export const useTableActionColumnWidth = () => useTableColumnsStore((state) => state.tableActions);

export const useTotalColumnsWidth = () =>
  useTableColumnsStore((state) => {
    // only add the values if they are a number
    const values = Object.values(state as unknown as Record<string, number>).filter((value) => typeof value === 'number');
    //const values = [state.name, state.billCycleDuration, state.description, state.url];
    return values.reduce((acc: number, curr: number) => acc + curr, 0);
  });

export const useColumnOrdinal = (column: string) =>
  useTableColumnsStore((state) => state.columnOrdinal[column as keyof TableColumnsState['columnOrdinal']] ?? 0);

export const useColumnOrdinalObject = () => useTableColumnsStore((state) => state.columnOrdinal);

export const useColumnsOrderedByOrdinal = () =>
  useTableColumnsStore(
    useShallow((state) => {
      return Object.entries(state.columnOrdinal)
        .sort((a, b) => a[1] - b[1])
        .map(([key, _value]) => key);
    }),
  );

export const useTableColumnsActions = () => useTableColumnsStore((state) => state.actions);

