import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import BillsCurrentMonth from './BillsCurrentMonth';
import DashboardDateTitle from './DashboardDateTitle';
import SummarySectionCards from './SummarySectionCards';
import YearDueChartParent from './charts/YearDueChartParent';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function HomeDashboardWrapper({ searchParamsPromise }: Props) {
  return (
    <div className="flex w-full flex-col gap-y-6">
      <DashboardDateTitle searchParamsPromise={ searchParamsPromise } />
      <SummarySectionCards searchParamsPromise={ searchParamsPromise } />
      <YearDueChartParent searchParamsPromise={ searchParamsPromise } />
      <BillsCurrentMonth searchParamsPromise={ searchParamsPromise } />
    </div>
  );
}
