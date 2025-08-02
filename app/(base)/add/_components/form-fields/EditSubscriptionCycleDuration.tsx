'use client';

import z from 'zod';
import { useFormContext } from 'react-hook-form';

import HFSelect, { HFSelectOption } from '@/components/hook-form/HFSelect';
import { BILL_CYCLE_DURATION_OPTIONS } from '@/models/subscriptions/subscriptions.model';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionCycleDuration() {
  const { control } = useFormContext<z.infer<typeof subscriptionEditableSchema>>();

  return (
    <HFSelect
      name="billCycleDuration"
      label="Bill Cycle Duration"
      control={ control }
      options={ BILL_CYCLE_DURATION_OPTIONS as unknown as HFSelectOption[] }
      formItemClassName="w-full"
    />
  );
}
