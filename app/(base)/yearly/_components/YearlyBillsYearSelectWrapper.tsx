import { YEARLY_BILLS_YEARS } from '@/constants/constants';

import { getYearlyBillsSelection } from './yearly-bills.utils';
import YearlyBillsYearSelect from './YearlyBillsYearSelect';

interface YearlyBillsYearSelectWrapperProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YearlyBillsYearSelectWrapper({ searchParamsPromise }: YearlyBillsYearSelectWrapperProps) {
  const searchParams = await searchParamsPromise;
  const { selectedYear } = await getYearlyBillsSelection(searchParams);

  // newest first
  const options: number[] = [...YEARLY_BILLS_YEARS].toSorted((a, b) => b - a);

  return <YearlyBillsYearSelect years={ options } selectedYear={ selectedYear } />;
}
