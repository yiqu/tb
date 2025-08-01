'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { billAddableSchema } from '@/validators/bills/bill.schema';

export default function AddBillIsReimbursed() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <HFCheckbox
      name="reimbursed"
      label="Reimbursed"
      control={ control }
      helperText="Check this box if you have received the money back from the company."
      formItemClassName="w-full"
    />
  );
}
