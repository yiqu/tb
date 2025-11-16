import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import BillsCurrentMonth from './BillsCurrentMonth';
import DashboardDateTitle from './DashboardDateTitle';
import YearDueChartParent from './YearDueChartParent';
import SummarySectionCards from './SummarySectionCards';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function HomeDashboardWrapper({ searchParamsPromise }: Props) {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <DashboardDateTitle searchParamsPromise={ searchParamsPromise } />
      <SummarySectionCards />
      <YearDueChartParent />
      <BillsCurrentMonth searchParamsPromise={ searchParamsPromise } />
    </div>
  );
}
