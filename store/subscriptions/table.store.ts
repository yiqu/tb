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

  actions: {
    setColumnWidth: (_column: string, _width: number) => void;
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

      actions: {
        setColumnWidth: (column, width) => {
          set((_state) => ({
            [column]: width,
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
      }),
    },
  ),
);

export const useTableColumn = (column: string) =>
  useTableColumnsStore((state) => (state[column as keyof TableColumnsState] as number) ?? 120);
export const useTableActionColumnWidth = () => useTableColumnsStore((state) => state.tableActions);


export const useTableColumnsActions = () => useTableColumnsStore((state) => state.actions);

