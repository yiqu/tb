import { cn } from '@/lib/utils';
import { getUSDFormatter } from '@/lib/number.utils';
import RowStack from '@/shared/components/RowStack';
import MonthImage from '@/components/month/MonthImage';
import ColumnStack from '@/shared/components/ColumnStack';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { CardContent } from '@/components/ui/card';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { YearlyBillsMonth } from '@/models/bills/yearly-bills.model';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import YearlyBillsMonthStat from './YearlyBillsMonthStat';
import BillsTableParentContent from '../../bills/_components/BillsTableParentContent';

const usdFormatter = getUSDFormatter();

interface YearlyBillsMonthSectionProps {
  year: number;
  month: YearlyBillsMonth;
  sortData: SortDataModel | null;
  isCurrentMonth: boolean;
}

export default function YearlyBillsMonthSection({ year, month, sortData, isCurrentMonth }: YearlyBillsMonthSectionProps) {
  // shape the month's bills the way the shared bills table expects, with no pagination
  const billDues: BillDueWithSubscriptionAndSortData = {
    billDues: month.billDues,
    sortData,
    totalPages: 1,
    totalBillsCount: month.billsCount,
    startIndex: 0,
    endIndex: month.billsCount,
    yearParams: `${year}`,
    monthParams: `${month.month}`,
    startDateEpoch: month.startDateEpoch,
    endDateEpoch: month.endDateEpoch,
  };

  return (
    <section id={ `yearly-month-${month.month}` } className="w-full scroll-mt-24">
      <ColumnStack className="w-full gap-y-3">
        <RowStack className="w-full flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <RowStack className="items-center gap-x-3">
            <MonthImage month={ `${month.month}` } height={ 44 } />
            <ColumnStack>
              <Typography variant="h3" className={ cn({ 'text-primary': isCurrentMonth }) }>
                { month.monthName }
              </Typography>
              <Typography variant="caption1">{ isCurrentMonth ? `${year} · Current month` : year }</Typography>
            </ColumnStack>
          </RowStack>
          <RowStack className="flex-wrap items-stretch gap-3">
            <YearlyBillsMonthStat label="Total due" value={ usdFormatter.format(month.totalDue) } />
            <YearlyBillsMonthStat label="Total due to date" value={ usdFormatter.format(month.totalDueToDate) } />
            <YearlyBillsMonthStat
              label="Bills due"
              value={ `${month.billsCount} ${month.billsCount === 1 ? 'bill' : 'bills'}` }
              subValue={ `from ${month.subscriptionsCount} ${month.subscriptionsCount === 1 ? 'subscription' : 'subscriptions'}` }
            />
          </RowStack>
        </RowStack>

        { month.billsCount === 0 ?
          <DisplayCard className="py-6">
            <CardContent>
              <Typography variant="nodata1">No bills due in { month.monthName }.</Typography>
            </CardContent>
          </DisplayCard>
        : <DisplayCard className="w-full py-0">
            <CardContent className="overflow-x-auto px-0">
              <BillsTableParentContent
                billDues={ billDues }
                sortData={ sortData }
                pageId={ SORT_DATA_PAGE_IDS.yearly }
                tableId={ `yearly-bills-table-${month.month}` }
                loadingMaskRowCount={ month.billsCount }
              />
            </CardContent>
          </DisplayCard>
        }
      </ColumnStack>
    </section>
  );
}
