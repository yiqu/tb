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
            staleTime: 1000 * 60 * 1, // 1 minute
            gcTime: 1000 * 60 * 10, // 10 minutes
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={ queryClient }>{ children }</QueryClientProvider>;
}
