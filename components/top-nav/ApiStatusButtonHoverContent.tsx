/* eslint-disable better-tailwindcss/multiline */
'use client';

import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';
import { RefreshCcw, CloudAlert, CircleCheck, CircleAlert } from 'lucide-react';

import { getUserFirebaseQueryOptions } from '@/server/user/query/users';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import Typography from '../typography/Typography';

export default function ApiStatusButtonHoverContent() {
  const { isLoading, isError, dataUpdatedAt, errorUpdatedAt, data, refetch, errorUpdateCount } = useQuery({
    ...getUserFirebaseQueryOptions(),
  });

  const handleOnRefresh = () => {
    refetch();
  };

  if (isLoading && errorUpdateCount === 0) {
    return (
      <div className="flex w-full flex-col gap-y-2">
        <Typography variant="body1">API Status</Typography>
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  const isSuccess = !isError && data;

  if (isSuccess) {
    return <StatusSuccess dataUpdatedAt={ dataUpdatedAt } handleOnRefresh={ handleOnRefresh } />;
  }

  if (isError || errorUpdateCount > 0) {
    return <StatusError errorUpdatedAt={ errorUpdatedAt } handleOnRefresh={ handleOnRefresh } />;
  }

  return <div></div>;
}

function StatusSuccess({ dataUpdatedAt, handleOnRefresh }: { dataUpdatedAt: number; handleOnRefresh: () => void }) {
  let lastUpdatedRelative = DateTime.fromMillis(dataUpdatedAt).toRelative();
  lastUpdatedRelative = lastUpdatedRelative?.includes('0 seconds ago') ? 'Just now' : lastUpdatedRelative;

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <CircleCheck className="text-green-800 dark:text-green-600" />
          <Typography variant="body1" className="font-semibold text-green-800 dark:text-green-600">
            All Systems Operational
          </Typography>
        </div>
        <Button variant="ghost" size="icon" onClick={ handleOnRefresh } title="Recheck all statuses">
          <RefreshCcw className="" size={ 18 } />
        </Button>
      </div>
      <Separator />
      <div className="flex w-full flex-col items-start justify-start gap-y-1">
        <div className="w-full">
          <div className="flex w-full flex-row items-center justify-between">
            <Typography variant="body1" className="font-semibold">
              API
            </Typography>
            <CircleCheck className="text-green-800 dark:text-green-600" size={ 18 } />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            { dataUpdatedAt > 0 ?
              <Typography variant="body1">Last updated: { lastUpdatedRelative }</Typography>
            : '' }
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex w-full flex-col items-start justify-start gap-y-1">
        <div className="w-full">
          <div className="flex w-full flex-row items-center justify-between">
            <Typography variant="body1" className="font-semibold">
              Database
            </Typography>
            <CircleCheck className="text-green-800 dark:text-green-600" size={ 18 } />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            { dataUpdatedAt > 0 ?
              <Typography variant="body1">Last updated: { lastUpdatedRelative }</Typography>
            : '' }
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex w-full flex-col items-start justify-start gap-y-1">
        <div className="w-full">
          <div className="flex w-full flex-row items-center justify-between">
            <Typography variant="body1" className="font-semibold">
              Web Hooks
            </Typography>
            <CircleCheck className="text-green-800 dark:text-green-600" size={ 18 } />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            { dataUpdatedAt > 0 ?
              <Typography variant="body1">Last updated: { lastUpdatedRelative }</Typography>
            : '' }
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusError({ errorUpdatedAt, handleOnRefresh }: { errorUpdatedAt: number; handleOnRefresh: () => void }) {
  let lastUpdatedRelative = DateTime.fromMillis(errorUpdatedAt).toRelative();
  lastUpdatedRelative = lastUpdatedRelative?.includes('0 seconds ago') ? 'Just now' : lastUpdatedRelative;

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <CloudAlert className={ `text-red-800 dark:text-red-400` } />
          <Typography variant="body1" className="font-semibold text-red-800 dark:text-red-400">
            System Outage
          </Typography>
        </div>
        <Button variant="ghost" size="icon" onClick={ handleOnRefresh } title="Recheck all statuses">
          <RefreshCcw className="" size={ 18 } />
        </Button>
      </div>
      <Separator />
      <div className="flex w-full flex-col items-start justify-start gap-y-1">
        <div className="w-full">
          <div className="flex w-full flex-row items-center justify-between">
            <Typography variant="body1" className="font-semibold">
              API
            </Typography>
            <CircleAlert className={ `text-red-800 dark:text-red-400` } size={ 18 } />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            { errorUpdatedAt > 0 ?
              <Typography variant="body1">Last updated: { lastUpdatedRelative }</Typography>
            : '' }
          </div>
        </div>
      </div>
    </div>
  );
}
