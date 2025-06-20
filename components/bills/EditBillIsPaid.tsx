'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { billEditableSchema } from '@/validators/bills/bill.schema';

import { HFCheckbox } from '../hook-form/HFCheckbox';

export default function EditBillIsPaid() {
  const { control } = useFormContext<z.infer<typeof billEditableSchema>>();

  return <HFCheckbox name="paid" label="Paid" control={ control } helperText="Check this box if you have paid the bill." />;
}
