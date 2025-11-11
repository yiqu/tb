import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

import BillsCurrentMonth from './BillsCurrentMonth';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default function HomeDashboardWrapper({ searchParamsPromise }: Props) {
  return (
    <div>
      <BillsCurrentMonth searchParamsPromise={ searchParamsPromise } />
    </div>
  );
}
