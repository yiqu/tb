import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { NavigationMonthData, CurrentMonthDateData } from '@/models/bills/bills.model';
import { getNavigationMonthData, getCurrentMonthDateDataCached } from '@/server/bills/bills.server';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function BillsActivityMonthSelectNextButtonContent({}: Props) {
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const { currentYear, currentMonth } = dateData;
  const navigationMonthData: NavigationMonthData = await getNavigationMonthData(currentMonth, currentYear);
  const { nextMonthName, nextYear, nextMonth } = navigationMonthData;

  return (
    <>
      <span>{ nextMonthName ?? 'Next month' }</span>
      <span>
        { nextMonth }/{ nextYear }
      </span>
    </>
  );
}
