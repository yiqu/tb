'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Palette } from 'lucide-react';

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
  const [currentVibe, setCurrentVibe] = useState<AppVibe>(vibe);

  const handleVibeChange = (nextVibe: string) => {
    const vibe = nextVibe as AppVibe;
    setCurrentVibe(vibe);

    toast.promise(setSettingsApplicationVibe(vibe), {
      loading: 'Updating vibe...',
      success: () => `Vibe updated to ${APP_VIBE_OPTIONS_MAP[vibe]}.`,
      error: (error: Error) => `Failed to update vibe. ${error.message}`,
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
        <Palette className="size-4" />
        Vibe
      </Typography>
      { !isClient ?
        <Skeleton className="h-8 w-28 rounded-md" />
      : <Select value={ currentVibe } onValueChange={ handleVibeChange }>
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
