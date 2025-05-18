import { Suspense } from 'react';

import { FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Country } from '@/models/country/country.model';
import { getCountryList } from '@/server/countries/country-list.server';

import CountryInput from './CountryListInput';

export default function CountryListWrapper() {
  const countryList: Promise<Country[]> = getCountryList();

  return (
    <Suspense fallback={ <FallBack /> }>
      <CountryInput countryListPromise={ countryList } />
    </Suspense>
  );
}

function FallBack() {
  return (
    <div className="flex flex-col gap-y-2">
      <FormLabel>Country</FormLabel>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}
