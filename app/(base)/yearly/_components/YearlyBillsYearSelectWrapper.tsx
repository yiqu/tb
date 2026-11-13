import { YearlyBillsYearOptions } from '@/models/bills/yearly-bills.model';
import { getYearlyBillsYearOptionsCached } from '@/server/bills/yearly-bills.server';

import { getYearlyBillsSelection } from './yearly-bills.utils';
import YearlyBillsYearSelect from './YearlyBillsYearSelect';

interface YearlyBillsYearSelectWrapperProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YearlyBillsYearSelectWrapper({ searchParamsPromise }: YearlyBillsYearSelectWrapperProps) {
  const searchParams = await searchParamsPromise;
  const { selectedYear } = await getYearlyBillsSelection(searchParams);
  const { years }: YearlyBillsYearOptions = await getYearlyBillsYearOptionsCached();

  // keep a year typed into the URL selectable even if it has no bills
  const options: number[] = years.includes(selectedYear) ? years : [...years, selectedYear].toSorted((a, b) => b - a);

  return <YearlyBillsYearSelect years={ options } selectedYear={ selectedYear } />;
}
