import { queryOptions } from '@tanstack/react-query';

import { SortConfig } from '@/store/sorter/table-sort';

export interface FakeSortedSearchResponse {
  /** The fake GET request URL that was "called". */
  requestUrl: string;
  /** The sort configs that produced the request. */
  sortConfig: SortConfig[];
  fetchedAt: string;
}

// Fetch functions
async function getFakeSortedSearch(sortConfig: SortConfig[], searchParamsString: string): Promise<FakeSortedSearchResponse> {
  const requestUrl = `search?${searchParamsString}`;

  // Fake (example) GET request. In a real app this would be something like:
  // const response = await fetch(`/api/${requestUrl}`, { signal });
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    requestUrl,
    sortConfig,
    fetchedAt: new Date().toISOString(),
  };
}

// TanStack Query options
export function getFakeSortedSearchQueryOptions(sortConfig: SortConfig[], searchParamsString: string) {
  return queryOptions({
    queryKey: ['fake-sorted-search', searchParamsString],
    queryFn: async () => await getFakeSortedSearch(sortConfig, searchParamsString),
  });
}
