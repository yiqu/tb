'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TanstackQueryClientProvider({ children }: { children: React.ReactNode }) {
  // Create client inside a hook to avoid recreating it on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // A Query that has a staleTime set is considered fresh until that staleTime has elapsed.
            gcTime: 1000 * 60 * 5, // 5 minutes.  "inactive" queries are garbage collected after this time. By default, "inactive" queries are garbage collected after 5 minutes.
            retry: 0,
            refetchOnWindowFocus: process.env.NODE_ENV === 'production' ? true : false,
          },
        },
      }),
  );

  return <QueryClientProvider client={ queryClient }>{ children }</QueryClientProvider>;
}
