/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { useQuery } from '@tanstack/react-query';
import { CloudAlert, LaptopMinimalCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getUserFirebaseQueryOptions } from '@/server/user/query/users';

import { Skeleton } from '../ui/skeleton';

export default function ApiStatusButtonContent() {
  const { isLoading, isError, errorUpdateCount, isSuccess } = useQuery({
    ...getUserFirebaseQueryOptions(),
    refetchInterval: 1000 * 1 * 60 * 5, // 5 minutes
  });

  if (isLoading && errorUpdateCount === 0) {
    return <Skeleton className="h-4 w-4 rounded-full" />;
  }

  if (isError) {
    return <CloudAlert className={ cn('text-destructive', {}) } />;
  }

  if (isSuccess) {
    return <LaptopMinimalCheck className={ cn(`text-green-800 dark:text-green-700`) } />;
  }

  return <Skeleton className="h-4 w-4 rounded-full" />;
}
