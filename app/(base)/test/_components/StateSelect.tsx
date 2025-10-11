import { useFormContext } from 'react-hook-form';

import HFSelect from '@/components/hook-form/HFSelect';
import { HFSelectOption } from '@/models/general/forms.model';

export default function StateSelect({ onChanged }: { onChanged: (_state: string) => void }) {
  const { control } = useFormContext();
  return <HFSelect name="state" control={ control } options={ stateOptions } placeholder="Select a state" onChanged={ onChanged } />;
}

const stateOptions: HFSelectOption[] = [
  { label: 'California', value: 'CA' },
  { label: 'New York (slow)', value: 'NY' },
  { label: 'Texas (slowest)', value: 'TX' },
];
