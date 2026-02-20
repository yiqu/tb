'use client';

import { useOptimistic, useTransition } from 'react';
import { RefreshCcw, ListChevronsDownUp, ListChevronsUpDown } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAppSetting, AppSettingContextType } from '@/providers/AppSettingProvider';

import { Switch } from '../ui/switch';
import Typography from '../typography/Typography';

interface Props {
  isCompactMode: boolean;
}

export default function ThemeAndMoreCompactToggle({ isCompactMode }: Props) {
  const isClient = useClientOnly();
  const [isPending, startTransition] = useTransition();
  const [optimisticIsCompactMode, setOptimisticIsCompactMode] = useOptimistic(isCompactMode);
  const appSettingContext: AppSettingContextType = useAppSetting();
  const CompactIcon = optimisticIsCompactMode ? ListChevronsDownUp : ListChevronsUpDown;

  const handleOnToggle = (value: boolean) => {
    startTransition(async () => {
      setOptimisticIsCompactMode(value);
      appSettingContext.setCompactMode(value);
    });
  };

  return (
    <DropdownMenuItem
      onSelect={ (event) => event.preventDefault() }
      className="
        flex items-center justify-between gap-x-3
        hover:bg-transparent! hover:text-black!
        dark:hover:text-white!
      "
    >
      <Typography variant="body1" className="flex shrink-0 items-center gap-x-2">
        { isPending ?
          <RefreshCcw className="size-4 animate-spin" />
        : <CompactIcon className="
          size-4
          hover:text-black!
          dark:hover:text-white!
        " /> }
        Compact Mode
      </Typography>
      { !isClient ?
        <Skeleton className="h-8 w-28 rounded-md" />
      : <Switch checked={ optimisticIsCompactMode } onCheckedChange={ handleOnToggle } /> }
    </DropdownMenuItem>
  );
}
