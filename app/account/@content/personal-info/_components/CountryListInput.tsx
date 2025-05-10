'use client';

import { use } from 'react';
import { Earth } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Country } from '@/models/country/country.model';
import HFSelect, { HFSelectOption } from '@/components/hook-form/HFSelect';

export default function CountryInput({ countryListPromise }: { countryListPromise: Promise<Country[]> }) {
  const { control } = useFormContext();
  const countryList = use(countryListPromise);

  const selectOptions: HFSelectOption[] = countryList.map((country) => ({
    label: country.name,
    value: country.code,
  }));

  return (
    <HFSelect
      control={ control }
      options={ selectOptions }
      name="country"
      label="Country"
      startAdornment={ <Earth size={ 16 } className="text-muted-foreground/90" /> }
      placeholder="USA"
    />
  );
}
