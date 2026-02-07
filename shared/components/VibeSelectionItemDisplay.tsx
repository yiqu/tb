import { SelectItem } from '@/components/ui/select';
import { HFSelectOption } from '@/components/hook-form/HFSelect';
import { AppVibe, APP_VIBE_COLORS_MAP } from '@/models/settings/general-settings.models';

export default function VibeSelectionItemDisplay({ option }: { option: HFSelectOption }) {
  const colors = APP_VIBE_COLORS_MAP[option.value as AppVibe];

  return (
    <SelectItem key={ option.value } value={ option.value } className="focus:text-current">
      <span className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 truncate">{ option.label }</span>
        <span className="size-3 shrink-0 rounded-sm border border-border/50" style={ { backgroundColor: colors.primary } } />
        <span className="size-3 shrink-0 rounded-sm border border-border/50" style={ { backgroundColor: colors.secondary } } />
        <span className="size-3 shrink-0 rounded-sm border border-border/50" style={ { backgroundColor: colors.accent } } />
      </span>
    </SelectItem>
  );
}
