'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCurrencyInput } from '@/components/hook-form/HFCurrencyInput';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionCost() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <HFCurrencyInput
      name="cost"
      label="Default Cost"
      control={ control }
      onFocus={ (event) => {
        event.target.select();
      } }
      formItemClassName="w-full"
    />
  );
}
