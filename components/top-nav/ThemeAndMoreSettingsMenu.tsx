import { Suspense } from 'react';
import { Palette, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Skeleton } from '../ui/skeleton';
import Typography from '../typography/Typography';
import ThemeAndMoreSettingsMenuSettingsLink from './ThemeAndMoreSettingsMenuSettingsLink';
import ThemeAndMoreSettingsMenuThemeSwitcher from './ThemeAndMoreSettingsMenuThemeSwitcher';
import ThemeAndMoreSettingsMenuVibePickerParent from './ThemeAndMoreSettingsMenuVibePickerParent';

export default function ThemeAndMoreSettingsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-70" align="end" sideOffset={ 16 }>
        <ThemeAndMoreSettingsMenuThemeSwitcher />
        <Suspense fallback={ <VibeSelectionSkeleton /> }>
          <ThemeAndMoreSettingsMenuVibePickerParent />
        </Suspense>


        <DropdownMenuSeparator />
        <ThemeAndMoreSettingsMenuSettingsLink />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function VibeSelectionSkeleton() {
  return (
    <RowStack className="h-8 w-full gap-x-2 px-2">
      <Typography variant="body1" className="flex shrink-0 items-center gap-x-2">
        <Palette className="size-4" />
        Vibe
      </Typography>
      <Skeleton className="h-full w-full" />
    </RowStack>
  );
}

