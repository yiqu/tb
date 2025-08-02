'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFInputField } from '@/components/hook-form/HFInput';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionDescription() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <HFInputField
      name="description"
      label="Description"
      control={ control }
      formItemClassName="w-full"
      placeholder="A description of the subscription (optional)"
    />
  );
}
