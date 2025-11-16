import z from 'zod';

import DisplayCard from '@/shared/components/DisplayCard';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import CurrentMonthBillsTable from './CurrentMonthBillsTable';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function BillsCurrentMonth({ searchParamsPromise }: Props) {
  return (
    <DisplayCard>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Bills</CardTitle>
        <CardDescription>View, edit, and manage bills that are due this month.</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <CurrentMonthBillsTable searchParamsPromise={ searchParamsPromise } />
      </CardContent>
      <CardFooter className=""></CardFooter>
    </DisplayCard>
  );
}
