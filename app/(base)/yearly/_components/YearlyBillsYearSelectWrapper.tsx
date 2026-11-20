import { YEARLY_BILLS_YEARS } from '@/constants/constants';

import { getYearlyBillsSelection } from './yearly-bills.utils';
import YearlyBillsYearSelect from './YearlyBillsYearSelect';

interface YearlyBillsYearSelectWrapperProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YearlyBillsYearSelectWrapper({ searchParamsPromise }: YearlyBillsYearSelectWrapperProps) {
  const searchParams = await searchParamsPromise;
  const { selectedYear } = await getYearlyBillsSelection(searchParams);

  // the URL year is the source of truth: when it is outside the constant list, it is shown in the
  // dropdown for this page only, the constant itself does not change. Newest first
  const options: number[] = [...new Set([...YEARLY_BILLS_YEARS, selectedYear])].toSorted((a, b) => b - a);

  return <YearlyBillsYearSelect years={ options } selectedYear={ selectedYear } />;
}
