'use cache';

import { CardDescription } from '@/components/ui/card';
import Typography from '@/components/typography/Typography';
import { DashboardYearBillsChartData } from '@/models/charts/chart.model';

export default async function YearDueChartDescription({ chartDataPromise }: { chartDataPromise: Promise<DashboardYearBillsChartData> }) {
  const chartData: DashboardYearBillsChartData = await chartDataPromise;

  const totalBills = chartData.chartData.reduce((sum, node) => {
    return sum + node.billDues.length;
  }, 0);

  return (
    <CardDescription>
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Typography>
          Tracking { totalBills } bill{ totalBills > 1 ? 's' : '' } across { chartData.subscriptions.length } subscription
          { chartData.subscriptions.length > 1 ? 's' : '' }.
        </Typography>
      </div>
    </CardDescription>
  );
}
