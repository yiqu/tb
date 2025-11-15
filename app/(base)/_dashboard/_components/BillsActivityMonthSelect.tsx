import z from 'zod';

import { cn } from '@/lib/utils';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import { NavigationMonthData, CurrentMonthDateData } from '@/models/bills/bills.model';
import { getNavigationMonthData, getCurrentMonthDateDataCached } from '@/server/bills/bills.server';

import BillsActivityMonthSelectNextButton from './BillsActivityMonthSelectNext';
import BillsActivityMonthSelectPreviousButton from './BillsActivityMonthSelectPrevious';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function BillsActivityMonthSelect({ searchParamsPromise }: Props) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const isCurrentMonth = !searchParams.selectedMonthYear;

  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const { currentMonth, currentYear } = dateData;

  const navigationMonthData: NavigationMonthData = await getNavigationMonthData(currentMonth, currentYear, searchParams.selectedMonthYear);

  return (
    <ButtonGroup>
      <BillsActivityMonthSelectPreviousButton navigationMonthData={ navigationMonthData } />
      <ButtonGroupSeparator
        className={ cn('w-0.5! bg-primary', {
          'bg-green-700': isCurrentMonth,
        }) }
      />
      <BillsActivityMonthSelectNextButton navigationMonthData={ navigationMonthData } />
    </ButtonGroup>
  );
}
