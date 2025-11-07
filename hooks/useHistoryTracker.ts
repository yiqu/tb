import { useEffect, useTransition } from 'react';
import { usePathname, useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';

import { addHistoryEntry } from '@/server/history/history.server';

export default function useHistoryTracker() {
  const pathName = usePathname();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [_isPending, startTransition] = useTransition();

  useEffect(() => {
    if (pathName !== '/') {
      startTransition(async () => {
        const url: string = `${pathName}${searchParamsString ? `?${searchParamsString}` : ''}`;
        await addHistoryEntry(null, url);
      });
    }
  }, [pathName, searchParamsString]);

  return null;
}
