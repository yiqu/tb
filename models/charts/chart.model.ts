import { SubscriptionOriginal, BillDueWithSubscription } from '../bills/bills.model';

export type AllBillsChartNode = {
  dateStart: number;
  dateEnd: number;
  displayName: string | null;
  year: number;
  month: number;
  billDues: BillDueWithSubscription[];
  totalCost: number;
} & {
  [key: string]:
    | {
        totalCost: number;
        billDues: BillDueWithSubscription[];
      }
    | number
    | string
    | BillDueWithSubscription[]
    | undefined
    | null;
};

export type AllBillsChartData = AllBillsChartNode[];

export type DashboardYearBillsChartData = {
  subscriptions: SubscriptionOriginal[];
  chartData: AllBillsChartData;
  firstBillDue?: BillDueWithSubscription;
  lastBillDue?: BillDueWithSubscription;
};

export const NON_CHART_DATA_KEYS = ['dateStart', 'dateEnd', 'displayName', 'year', 'month', 'totalCost', 'billDues'];

export const CHART_COLORS: Record<string, string> = {
  ByteGrad: '#99cc00',
  'ChatGPT Plus': '#339966',
  'CompTIA Security Plus': '#ffb31a',
  'Cursor IDE Pro': '#39ac73',
  'Education to Training Hours': '#8dd1e1',
  'Flaticon Pro': '#d084d0',
  'GitHub Copilot': '#8c1aff',
  'GitHub Pro': '#cc99ff',
  'Loading io': '#ff6b9d',
  'MUI Minimal Dashboard': '#c9c9ff',
  'MUI X Pro License': '#b794f6',
  Medium: '#fb923c',
  'Microsoft 365': '#0066ff',
  'MonaLisa Typeface': '#f472b6',
  'MongoDB Atlas Flex': '#00b33c',
  'Pro Nextjs By Jack Harrington': '#3385ff',
  'T3 Chat': '#ff66cc',
  'UI dot dev': '#ffcc00',
  'Vercel Pro': '#999999',
  'Vercel v0': '#4da6ff',
  Netflix: '#666666',
  'YouTube TV Base': '#800080',
  'Disney+': '#1e3a8a',
  'Paramount+': '#007bff',
  'Peacock TV': '#00bfff',
  'HBO Max': '#008080',
  'Apple TV': '#000080',
  'Amazon Prime Videos': '#ffa500',
  DAZN: '#997300',
};
