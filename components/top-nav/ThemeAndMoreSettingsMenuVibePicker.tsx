'use client';

import toast from 'react-hot-toast';
import { Palette, RefreshCcw } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { setSettingsApplicationVibe } from '@/server/settings/vibe-select';
import VibeSelectionItemDisplay from '@/shared/components/VibeSelectionItemDisplay';
import { Select, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';
import { AppVibe, APP_VIBE_OPTIONS_MAP, APP_VIBE_OPTIONS_LIST } from '@/models/settings/general-settings.models';

import Typography from '../typography/Typography';

interface Props {
  vibe: AppVibe;
}

export default function ThemeAndMoreSettingsMenuVibePicker({ vibe }: Props) {
  const isClient = useClientOnly();
  const [isPending, startTransition] = useTransition();
  const [optimisticVibe, setOptimisticVibe] = useOptimistic(vibe);

  const handleVibeChange = (nextVibe: string) => {
    const selected = nextVibe as AppVibe;
    startTransition(async () => {
      setOptimisticVibe(selected);
      try {
        await setSettingsApplicationVibe(selected);
        toast.remove();
        toast.success(`Vibe updated to ${APP_VIBE_OPTIONS_MAP[selected]}.`);
      } catch (error) {
        toast.error(`Failed to update vibe. ${(error as Error).message}`);
      }
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
        : <Palette className="
          size-4
          hover:text-black!
          dark:hover:text-white!
        " /> }
        Vibe
      </Typography>
      { !isClient ?
        <Skeleton className="h-8 w-28 rounded-md" />
      : <Select value={ optimisticVibe } onValueChange={ handleVibeChange }>
        <SelectTrigger size="sm" className="
          max-w-52 min-w-52 cursor-pointer bg-muted/70
          dark:bg-muted/30
          [&_svg]:text-foreground!
        ">
          <SelectValue placeholder="Select a vibe" className="truncate" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-120" sideOffset={ 4 }>
          { APP_VIBE_OPTIONS_LIST.map((option) => (
            <VibeSelectionItemDisplay key={ option.value } option={ option } />
            )) }
        </SelectContent>
      </Select>
      }
    </DropdownMenuItem>
  );
}
