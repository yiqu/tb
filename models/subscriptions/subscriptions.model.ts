import { SortDataModel } from '../sort-data/SortData.model';
import { FavoriteEntity } from '../favorites/favorite.model';
import { BillDueWithSubscription } from '../bills/bills.model';

export interface SubscriptionPostBody {
  name: string;
  billCycleDuration: string;
  billStartDate: string;
  approved: boolean;
  signed: boolean;
  cost: number;

  description?: string;
  url?: string;
}

export interface SubscriptionOriginal {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  approved: boolean;
  signed: boolean;
  dateAdded: Date;
  updatedAt: Date | null;
  cost: number;
  billCycleInDays: number | null; // deprecated
  billCycleDuration: 'yearly' | 'monthly' | 'once' | string; // yearly, monthly, once
  billStartDate: string | null; //2023-07-30  , YYYY-MM-DD
}

export interface SubscriptionWithBillDues extends SubscriptionOriginal {
  billDues: BillDueWithSubscription[];
  billDuesCurrentYearCount?: number;
  billDuesCurrentYearTotalCost?: number;
  favorites?: FavoriteEntity[];
}

export const BILL_CYCLE_DURATION_OPTIONS = [
  { label: 'Yearly', value: 'yearly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Once', value: 'once' },
] as const;

export type BillCycleDuration = (typeof BILL_CYCLE_DURATION_OPTIONS)[number]['value'];

export type SubscriptionWithBillDuesAndSortData = {
  subscriptions: SubscriptionWithBillDues[];
  sortData: SortDataModel | null;
  totalPages: number;
  totalSubscriptionsCount: number;
  startIndex: number;
  endIndex: number;
};
