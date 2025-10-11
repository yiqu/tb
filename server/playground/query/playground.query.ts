import { queryOptions } from '@tanstack/react-query';

import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL } from '@/constants/constants';

// Fetch functions
async function getCitiesByStateName(stateName: string, signal: AbortSignal): Promise<string[]> {
  //delay
  //await new Promise((resolve) => setTimeout(resolve, 2_000));

  if (stateName === 'TX') {
    // sleep for 7 seconds
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return ['Austin', 'Houston', 'San Antonio'];
  } else if (stateName === 'NY') {
    // sleep for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return ['New York', 'Buffalo', 'Albany'];
  } else {
    // sleep for 1 second
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return ['Los Angeles', 'San Diego', 'San Francisco'];
  }
}

// TanStack Query options
export function getCitiesByStateNameQueryOptions(stateName: string) {
  return queryOptions({
    queryKey: [
      'get-cities-by-state-name',
      {
        [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: stateName,
      },
    ],
    queryFn: async ({ signal }) => await getCitiesByStateName(stateName, signal),
  });
}
