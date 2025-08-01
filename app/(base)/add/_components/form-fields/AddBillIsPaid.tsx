'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { billAddableSchema } from '@/validators/bills/bill.schema';

export default function AddBillIsPaid() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <HFCheckbox
      name="paid"
      label="Paid"
      control={ control }
      helperText="Check this box if you have paid the bill."
      formItemClassName="w-full"
    />
  );
}
