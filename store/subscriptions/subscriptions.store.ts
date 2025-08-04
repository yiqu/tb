/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions, createJSONStorage } from 'zustand/middleware';

export type SubscriptionIdBeingEdited = {
  [key: string]: boolean;
};

type SubscriptionsTableViewState = {
  subscriptionIdBeingEdited: SubscriptionIdBeingEdited;
  lastEdited: number | null;

  // Actions
  setSubscriptionIdBeingEdited: (subscriptionId: string) => void;
  clearSubscriptionIdBeingEdited: (subscriptionId: string) => void;
  setLastEdited: (lastEdited: number) => void;
};

type SubscriptionsTableViewPersist = PersistOptions<
  SubscriptionsTableViewState,
  Omit<SubscriptionsTableViewState, 'setSubscriptionIdBeingEdited' | 'setLastEdited' | 'clearSubscriptionIdBeingEdited'>
>;

const subscriptionsTableViewStoreBase = create<SubscriptionsTableViewState>()(
  // devtools(
  persist(
    (set, get) => ({
      subscriptionIdBeingEdited: {},
      lastEdited: null,

      setSubscriptionIdBeingEdited: (subscriptionId: string) => {
        set((state: SubscriptionsTableViewState) => {
          return {
            subscriptionIdBeingEdited: {
              ...state.subscriptionIdBeingEdited,
              [subscriptionId]: true,
            },
          };
        });
      },

      clearSubscriptionIdBeingEdited: (subscriptionId: string) => {
        set((state: SubscriptionsTableViewState) => {
          return {
            subscriptionIdBeingEdited: {
              ...state.subscriptionIdBeingEdited,
              [subscriptionId]: false,
            },
          };
        });
      },

      setLastEdited: (lastEdited: number) => {
        set((state: SubscriptionsTableViewState) => {
          return {
            lastEdited: lastEdited,
          };
        });
      },
    }),
    {
      name: 'subscriptions-table-view-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lastEdited: state.lastEdited,
      }),
      // skipHydration: true,
    } as SubscriptionsTableViewPersist,
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

const subscriptionsTableViewStore = createSelectors(subscriptionsTableViewStoreBase);

export default subscriptionsTableViewStore;
