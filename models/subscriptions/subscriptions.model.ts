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
  billStartDate: string; //2023-07-30  , YYYY-MM-DD
}

