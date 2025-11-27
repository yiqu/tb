import { BillDueWithSubscription } from '../bills/bills.model';

export type AllBillsChartNode = {
  date: number;
  monthName?: string;
  billDues: BillDueWithSubscription[];
} & {
  [subscriptionName: string]: number;
};

export type AllBillsChartData = AllBillsChartNode[];
