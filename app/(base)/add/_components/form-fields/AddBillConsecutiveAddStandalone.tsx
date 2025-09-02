'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { billAddableSchema } from '@/validators/bills/bill.schema';
import { CONSECUTIVE_ADD_HELPER_TEXT } from '@/constants/constants';

export default function AddBillConsecutiveAddStandalone() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

  return (
    <HFCheckbox
      name="consecutiveAdd"
      label="Consecutive Add"
      control={ control }
      helperText={ CONSECUTIVE_ADD_HELPER_TEXT }
      formItemClassName="w-full"
    />
  );
}
