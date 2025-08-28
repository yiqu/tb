/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions, createJSONStorage } from 'zustand/middleware';

export type BillDueIdBeingEdited = {
  [key: string]: boolean;
};

type BillsTableViewState = {
  billDueIdBeingEdited: BillDueIdBeingEdited;
  lastEdited: number | null;

  // Actions
  setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => void;
  clearBillDueIdBeingEdited: (billDueId: string) => void;
  setLastEdited: (lastEdited: number) => void;

  actions: {
    setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => void;
  };
};

type BillsTableViewPersist = PersistOptions<BillsTableViewState, Omit<BillsTableViewState, 'setBillDueIdBeingEdited' | 'setLastEdited'>>;

const billsTableViewStoreBase = create<BillsTableViewState>()(
  // devtools(
  persist(
    (set, get) => ({
      billDueIdBeingEdited: {},
      lastEdited: null,

      actions: {
        setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => {
          set((state: BillsTableViewState) => {
            return {
              billDueIdBeingEdited: {
                ...state.billDueIdBeingEdited,
                [billDueId]: setEmpty ? false : true,
              },
            };
          });
        },
      },

      setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => {
        set((state: BillsTableViewState) => {
          return {
            billDueIdBeingEdited: {
              ...state.billDueIdBeingEdited,
              [billDueId]: setEmpty ? false : true,
            },
          };
        });
      },

      clearBillDueIdBeingEdited: (billDueId: string) => {
        set((state: BillsTableViewState) => {
          return {
            billDueIdBeingEdited: {
              ...state.billDueIdBeingEdited,
              [billDueId]: false,
            },
          };
        });
      },

      setLastEdited: (lastEdited: number) => {
        set((state: BillsTableViewState) => {
          return {
            lastEdited: lastEdited,
          };
        });
      },
    }),
    {
      name: 'bills-table-view-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastEdited: state.lastEdited,
      }),
      // skipHydration: true,
    } as BillsTableViewPersist,
  ),
  //),
);

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const billsTableViewStore = createSelectors(billsTableViewStoreBase);

// Non-selectors want to be exported for use in other files
export const useBillStoreActions = () => billsTableViewStoreBase((state) => state.actions);

export default billsTableViewStore;
