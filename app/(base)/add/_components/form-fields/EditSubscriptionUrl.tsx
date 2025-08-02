'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFInputField } from '@/components/hook-form/HFInput';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionUrl() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return <HFInputField name="url" label="URL" control={ control } formItemClassName="w-full" placeholder="Subscription website (optional)" />;
}
