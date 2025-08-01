'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { billAddableSchema } from '@/validators/bills/bill.schema';
import { HFCurrencyInput } from '@/components/hook-form/HFCurrencyInput';

export default function AddBillCurrency() {
  const { control } = useFormContext<z.infer<typeof billAddableSchema>>();

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
