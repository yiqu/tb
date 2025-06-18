/* eslint-disable better-tailwindcss/multiline */
'use client';

import { useFormContext } from 'react-hook-form';

import DisplayCard from '@/shared/components/DisplayCard';

import { CardContent } from '../ui/card';
import { HFCurrencyInput } from '../hook-form/HFCurrencyInput';

export default function EditBillForm() {
  const { control } = useFormContext();

  return (
    <DisplayCard>
      <CardContent>
        <HFCurrencyInput
          name="cost"
          label="Bill Cost"
          control={ control }
          onFocus={ (event) => {
            event.target.select();
          } }
          autoFocus
          className=""
        />
      </CardContent>
    </DisplayCard>
  );
}
