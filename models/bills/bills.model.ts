import { SortDataModel } from '../sort-data/SortData.model';

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

export interface Subscription {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  approved: boolean;
  signed: boolean;
  dateAdded: Date;
  updatedAt: Date | null;
  cost: number;
  billCycleInDays: number | null;
  billCycleDuration: string;
  billStartDate: string;
  isApiLoading?: boolean;
  billDues?: BillDue[];
  totalCost?: number;
}

export type SubscriptionOriginal = {
  approved: boolean;
  billCycleDuration: string;
  billCycleInDays: number | null;
  billStartDate: string | null; //"2024-05-25"
  cost: number;
  dateAdded: Date;
  updatedAt: Date | null;
  description: string | null;
  id: string;
  name: string;
  signed: boolean;
  url: string | null;
};

export interface BillDue {
  id: string;
  subscriptionId: string;
  dueDate: string; //'1716267600000'
  paid: boolean;
  reimbursed: boolean;
  dateAdded: Date;
  updatedAt: Date | null;
  isApiLoading?: boolean;
  isInThePast?: boolean;
  cost: number | null;
}

export type BillDueWithSubscription = BillDue & {
  subscription: SubscriptionOriginal;
};

export type BillDueWithSubscriptionAndSortData = {
  billDues: BillDueWithSubscription[];
  sortData: SortDataModel | null;
  totalPages: number;
  totalBillsCount: number;
  startIndex: number;
  endIndex: number;
};

export interface BillDueWithSubscription2 {
  id: string;
  subscriptionId: string;
  dueDate: string;
  paid: boolean;
  reimbursed: boolean;
  dateAdded: Date;
  updatedAt: Date | null;
  subscription: Subscription;
  weekNumber?: number;
  humanReadable?: string;
}

export interface BillDueGroupedByYear {
  [year: string]: BillDueWithSubscription[];
}

export interface BillsDueGroupedByYearObject {
  year: string;
  bills: BillDueWithSubscription[];
}
