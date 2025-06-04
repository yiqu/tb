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

export interface BillDue {
  id: string;
  subscriptionId: string;
  dueDate: string;
  paid: boolean;
  reimbursed: boolean;
  dateAdded: Date;
  updatedAt: Date | null;
  isApiLoading?: boolean;
  isInThePast?: boolean;
}

export interface BillDueWithSubscription {
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
