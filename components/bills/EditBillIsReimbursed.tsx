'use client';

import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

import { billEditableSchema } from '@/validators/bills/bill.schema';

import { HFCheckbox } from '../hook-form/HFCheckbox';

export default function EditBillIsReimbursed() {
  const { control } = useFormContext<z.infer<typeof billEditableSchema>>();

  return (
    <HFCheckbox
      name="reimbursed"
      label="Reimbursed"
      control={ control }
      helperText="Check this box if you have received the money back from the company."
    />
  );
}
