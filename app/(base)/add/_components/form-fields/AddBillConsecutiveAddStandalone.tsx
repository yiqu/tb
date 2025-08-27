'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { billAddableSchema } from '@/validators/bills/bill.schema';

export default function AddBillConsecutiveAddStandalone() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <HFCheckbox
      name="consecutiveAdd"
      label="Consecutive Add"
      control={ control }
      helperText={ 'Add another bill due after this one.' }
      formItemClassName="w-full"
    />
  );
}
