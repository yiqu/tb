import { SortDataModel } from '../sort-data/SortData.model';
import { BillDueWithSubscription } from './bills.model';

export interface YearlyBillsMonth {
  month: number; // 1-12
  monthName: string;
  billDues: BillDueWithSubscription[];
  totalDue: number;
  totalDueToDate: number; // running total from January through this month
  billsCount: number;
  subscriptionsCount: number;
  startDateEpoch: number;
  endDateEpoch: number;
}

export interface YearlyBillsData {
  year: number;
  months: YearlyBillsMonth[];
  totalDue: number;
  billsCount: number;
  subscriptionsCount: number;
  sortData: SortDataModel | null;
}

export interface YearlyBillsYearOptions {
  years: number[];
  currentYear: number;
}
