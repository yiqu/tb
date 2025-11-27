import z from 'zod';

import { AllBillsChartNode } from '@/models/charts/chart.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { getEntireBillsChartDataCached } from '@/server/bills/bills.server';

interface Props {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default async function YearDueChartParent({ searchParamsPromise }: Props) {
  const billDues: AllBillsChartNode[] = await getEntireBillsChartDataCached();
  return <div>Chart</div>;
}
