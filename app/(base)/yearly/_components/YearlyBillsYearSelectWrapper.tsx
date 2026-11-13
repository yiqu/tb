import { YearlyBillsYearOptions } from '@/models/bills/yearly-bills.model';
import { getYearlyBillsYearOptionsCached } from '@/server/bills/yearly-bills.server';

import { getYearlyBillsSelection } from './yearly-bills.utils';
import YearlyBillsYearSelect from './YearlyBillsYearSelect';

interface YearlyBillsYearSelectWrapperProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YearlyBillsYearSelectWrapper({ searchParamsPromise }: YearlyBillsYearSelectWrapperProps) {
  const searchParams = await searchParamsPromise;
  const { selectedYear, currentYear } = await getYearlyBillsSelection(searchParams);
  const { years }: YearlyBillsYearOptions = await getYearlyBillsYearOptionsCached();

  // always offer the current year (the cached list may predate New Year) and a year typed into the URL
  const options: number[] = [...new Set([...years, currentYear, selectedYear])].toSorted((a, b) => b - a);

  return <YearlyBillsYearSelect years={ options } selectedYear={ selectedYear } />;
}
