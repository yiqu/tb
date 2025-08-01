'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { billAddableSchema } from '@/validators/bills/bill.schema';

export default function AddBillConsecutiveAdd() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <HFCheckbox
      name="consecutiveAdd"
      label="Consecutive Add"
      control={ control }
      helperText={ undefined }
      formItemClassName=""
      labelClassName="border-none bg-background py-2.5 hover:bg-background"
    />
  );
}
