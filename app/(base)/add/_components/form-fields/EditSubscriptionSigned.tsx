'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { HFCheckbox } from '@/components/hook-form/HFCheckbox';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionSigned() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <HFCheckbox
      name="signed"
      label="Signed"
      control={ control }
      helperText="Check this box if you have signed the agreement"
      formItemClassName="w-full"
    />
  );
}
