'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFInputField } from '@/components/hook-form/HFInput';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionName() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return <HFInputField name="name" label="Name" control={ control } formItemClassName="w-full" placeholder="Subscription name (required)" />;
}
