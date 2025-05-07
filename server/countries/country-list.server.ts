'use server';

import { Country } from '@/models/country/country.model';

export async function getCountryList(): Promise<Country[]> {
  // return promise with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(COUNTRY_LIST);
    }, 1000);
  });
}

const COUNTRY_LIST: Country[] = [
  {
    name: 'United States',
    code: 'USA',
  },
  {
    name: 'United Kingdom',
    code: 'UK',
  },
  {
    name: 'Canada',
    code: 'CA',
  },
  {
    name: 'Australia',
    code: 'AU',
  },
];
