import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import ColumnStack from '@/shared/components/ColumnStack';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { getYearlyDueBillsCached } from '@/server/bills/yearly-bills.server';
import { YearlyBillsData, YearlyBillsMonth } from '@/models/bills/yearly-bills.model';

import { getYearlyBillsSelection } from './yearly-bills.utils';
import YearlyBillsMonthSection from './YearlyBillsMonthSection';
import YearlyBillsYearSummary from './YearlyBillsYearSummary';

interface YearlyBillsMonthsProps {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YearlyBillsMonths({ searchParamsPromise }: YearlyBillsMonthsProps) {
  const searchParams = await searchParamsPromise;
  const { selectedYear, currentYear, currentMonth } = await getYearlyBillsSelection(searchParams);
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.yearly);
  const yearlyBills: YearlyBillsData = await getYearlyDueBillsCached(selectedYear, sortData);

  return (
    <ColumnStack className="w-full gap-y-8">
      <YearlyBillsYearSummary yearlyBills={ yearlyBills } />
      { yearlyBills.months.map((month: YearlyBillsMonth) => (
        <YearlyBillsMonthSection
          key={ month.month }
          year={ yearlyBills.year }
          month={ month }
          sortData={ sortData }
          isCurrentMonth={ yearlyBills.year === currentYear && month.month === currentMonth }
        />
      )) }
    </ColumnStack>
  );
}
