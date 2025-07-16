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
  setBillDueIdBeingEdited: (billDueId: string) => void;
  clearBillDueIdBeingEdited: (billDueId: string) => void;
  setLastEdited: (lastEdited: number) => void;
};

type BillsTableViewPersist = PersistOptions<BillsTableViewState, Omit<BillsTableViewState, 'setBillDueIdBeingEdited' | 'setLastEdited'>>;

const billsTableViewStoreBase = create<BillsTableViewState>()(
  // devtools(
  persist(
    (set, get) => ({
      billDueIdBeingEdited: {},
      lastEdited: null,

      setBillDueIdBeingEdited: (billDueId: string) => {
        set((state: BillsTableViewState) => {
          return {
            billDueIdBeingEdited: {
              ...state.billDueIdBeingEdited,
              [billDueId]: true,
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

export default billsTableViewStore;
