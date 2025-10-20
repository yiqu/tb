/* eslint-disable no-unused-vars */
import z from 'zod';
import { create } from 'zustand';
import { DateTime } from 'luxon';
import { StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions, createJSONStorage } from 'zustand/middleware';

import { billAddableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { EST_TIME_ZONE, DEFAULT_DATE_FORMAT_STRING } from '@/lib/general.utils';

export type BillDueIdBeingEdited = {
  [key: string]: boolean;
};

type BillsTableViewState = {
  billDueIdBeingEdited: BillDueIdBeingEdited;
  lastEdited: number | null;
  recentlyAddedBillDues: BillDueWithSubscription[];

  // Actions
  // setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => void;
  // clearBillDueIdBeingEdited: (billDueId: string) => void;
  // setLastEdited: (lastEdited: number) => void;

  actions: {
    setBillDueIdBeingEdited: (billDueId: string, setEmpty?: boolean) => void;
    appendRecentlyAddedBillDues: (billDues: BillDueWithSubscription) => void;
    setLastEditedTimestamp: (lastEdited: number) => void;
  };
};

type BillsTableViewPersist = PersistOptions<BillsTableViewState, Omit<BillsTableViewState, 'setBillDueIdBeingEdited' | 'setLastEdited'>>;

const billsTableViewStoreBase = create<BillsTableViewState>()(
  // devtools(
  persist(
    (set, get) => ({
      billDueIdBeingEdited: {},
      lastEdited: null,
      recentlyAddedBillDues: [],

      actions: {
        appendRecentlyAddedBillDues: (billDue: BillDueWithSubscription) => {
          set((state: BillsTableViewState) => {
            const billDuesResult = [billDue, ...state.recentlyAddedBillDues];
            const formatted = billDuesResult.map((billDue) => {
              const dueDateInEst: string = DateTime.fromMillis(Number.parseInt(billDue.dueDate))
                .setZone(EST_TIME_ZONE)
                .toFormat(DEFAULT_DATE_FORMAT_STRING);
              const dateAddedInEst: string = DateTime.fromJSDate(new Date(`${billDue.dateAdded}`))
                .setZone(EST_TIME_ZONE)
                .toFormat(DEFAULT_DATE_FORMAT_STRING);
              const updatedAtInEst: string = DateTime.fromJSDate(new Date(`${billDue.updatedAt}`))
                .setZone(EST_TIME_ZONE)
                .toFormat(DEFAULT_DATE_FORMAT_STRING);
              return {
                ...billDue,
                dueDateInEst: dueDateInEst,
                dateAddedInEst: dateAddedInEst,
                updatedAtInEst: updatedAtInEst,
              };
            });

            return {
              recentlyAddedBillDues: formatted,
            };
          });
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

        setLastEditedTimestamp: (lastEdited: number) => {
          set((state: BillsTableViewState) => {
            return {
              lastEdited: lastEdited,
            };
          });
        },
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
export const useGetRecentlyAddedBillDues = () => billsTableViewStoreBase((state) => state.recentlyAddedBillDues);
export const useGetBillDueIdBeingEdited = () => billsTableViewStoreBase((state) => state.billDueIdBeingEdited);

export default billsTableViewStore;
