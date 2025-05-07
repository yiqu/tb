'use client';

import { use } from 'react';
import { MapPin } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import HFSelect from '@/components/hook-form/HFSelect';
import { Country } from '@/models/country/country.model';

export default function CountryInput({ countryListPromise }: { countryListPromise: Promise<Country[]> }) {
  const { control } = useFormContext();
  const countryList = use(countryListPromise);

  console.log('CountryInput', countryList);

  return <>A</>;
}
