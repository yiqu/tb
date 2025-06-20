'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { billEditableSchema } from '@/validators/bills/bill.schema';

import { HFCurrencyInput } from '../hook-form/HFCurrencyInput';

export default function EditBillCurrency() {
  const { control } = useFormContext<z.infer<typeof billEditableSchema>>();

  return (
    <HFCurrencyInput
      name="cost"
      label="Cost"
      control={ control }
      onFocus={ (event) => {
        event.target.select();
      } }
      formItemClassName="w-full"
    />
  );
}
