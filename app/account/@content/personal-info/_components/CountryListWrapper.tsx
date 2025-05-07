import { Suspense } from 'react';

import { Country } from '@/models/country/country.model';
import { getCountryList } from '@/server/countries/country-list.server';

import InputFallback from './InputFallback';
import CountryInput from './CountryListInput';

export default function CountryListWrapper() {
  console.log('CountryListWrapper');
  //const countryList: Promise<Country[]> = getCountryList();

  return null;
  return (
    <Suspense fallback={ <InputFallback /> }>
      { /* <CountryInput countryListPromise={ countryList } /> */ }
    </Suspense>
  );
}
