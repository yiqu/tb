'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionApproved() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <HFCheckbox
      name="approved"
      label="Approved"
      control={ control }
      helperText="Check this box if HR has approved the subscription"
      formItemClassName="w-full"
    />
  );
}
