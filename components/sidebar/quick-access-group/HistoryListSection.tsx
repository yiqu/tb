'use client';

import Link from 'next/link';
import { History } from 'lucide-react';
import startCase from 'lodash/startCase';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import { getParamsAsObject } from '@/lib/url.utils';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { HistoryEntry, HistoryEntryGroup, HistoryEntryResponse } from '@/models/history/history-entry.model';

import SidebarMenuSubButtonFavoritesParentWithActive from '../SidebarMenuSubButtonFavoritesParentWithActive';

export default function HistoryListSection({ allHistoryEntriesResponse }: { allHistoryEntriesResponse: HistoryEntryResponse }) {
  return (
    <>
      { allHistoryEntriesResponse.groups
        .filter((group: HistoryEntryGroup) => group.historyEntries.length > 0)
        .map((group: HistoryEntryGroup) => {
          return (
            <div key={ group.dateLabel }>
              <Typography className="mb-1">{ group.dateLabel }</Typography>
              { group.historyEntries.map((historyEntry: HistoryEntry) => {
                return (
                  <HoverCard key={ historyEntry.id } openDelay={ 150 } closeDelay={ 50 }>
                    <HoverCardTrigger asChild>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButtonFavoritesParentWithActive favoriteId="">
                          <Link href={ `${historyEntry.url}` } prefetch className="flex w-full items-center justify-start">
                            <History className="size-4" />
                            <HistoryItemNameParent entity={ historyEntry } />
                          </Link>
                        </SidebarMenuSubButtonFavoritesParentWithActive>
                      </SidebarMenuSubItem>
                    </HoverCardTrigger>
                    <HoverCardContent className="min-w-130" align="end" side="right">
                      <HistoryDetailsSearchQueryDisplay entity={ historyEntry } />
                    </HoverCardContent>
                  </HoverCard>
                );
              }) }
            </div>
          );
        }) }
    </>
  );
}

function HistoryItemNameParent({ entity }: { entity: HistoryEntry }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-5 w-full truncate" />;
  }

  return <Typography className="truncate">{ entity.url }</Typography>;
}

function HistoryDetailsSearchQueryDisplay({ entity }: { entity: HistoryEntry }) {
  const fullUrl = entity.url ?? '';
  const mainPageUrl = fullUrl.split('?')[0]; // bills, subscriptions, etc.
  const paramsString = fullUrl.split('?')[1] ?? '';
  const paramsObject = getParamsAsObject(new URLSearchParams(paramsString));

  const paramsKeys: string[] = Object.keys(paramsObject);
  const hasParams: boolean = paramsKeys.length > 0;

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <div className="flex w-full flex-row items-center justify-between gap-x-2">
        <Typography>History Entry</Typography>
        <div className="flex flex-row items-center justify-end gap-x-1">
          <Typography>{ mainPageUrl }</Typography>
        </div>
      </div>
      { hasParams ?
        <>
          <Separator />
          <div className="flex flex-col items-start justify-start gap-y-2">
            { paramsKeys.map((key) => {
              return (
                <div key={ key } className="flex flex-row items-center justify-start gap-x-2">
                  <Typography variant="label1">{ startCase(key) }:</Typography>
                  <Typography variant="labelvalue1" className="w-full truncate break-all">
                    { paramsObject[key] }
                  </Typography>
                </div>
              );
            }) }
          </div>
        </>
      : null }
      <Separator />
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Typography variant="label1" className="min-w-14">
          Full URL:
        </Typography>
        <Typography className="break-all">{ fullUrl }</Typography>
      </div>
      <Separator />
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Typography variant="label1" className="min-w-14">
          Date:
        </Typography>
        <DateRelativeDisplay time={ entity.dateAdded } />
      </div>
      <div className="flex flex-row items-center justify-start gap-x-2">
        <Typography variant="label1" className="min-w-14">
          Date:
        </Typography>
        <Typography>{ `${entity.dateAdded}` }</Typography>
      </div>
    </div>
  );
}
