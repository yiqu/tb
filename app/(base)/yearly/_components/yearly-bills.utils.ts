import { DateTime } from 'luxon';
import { connection } from 'next/server';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { yearlyBillsSearchParamsSchema } from '@/validators/bills/yearly-bills.schema';

export interface YearlyBillsSelection {
  selectedYear: number;
  currentYear: number;
  currentMonth: number;
}

// Selected year from the URL, or the current EST year when it is missing or invalid.
// Waits for the request first, because reading the current time during prerender is not allowed.
export async function getYearlyBillsSelection(searchParams: unknown): Promise<YearlyBillsSelection> {
  await connection();

  const now: DateTime = DateTime.now().setZone(EST_TIME_ZONE);
  const parsed = yearlyBillsSearchParamsSchema.safeParse(searchParams);
  const year: number | undefined = parsed.success ? parsed.data.year : undefined;

  return {
    selectedYear: year ?? now.year,
    currentYear: now.year,
    currentMonth: now.month,
  };
}
