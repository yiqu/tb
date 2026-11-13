'use client';

import { Rows3, Columns3 } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/custom/dropdown-menu';
import { useAppSetting, AppSettingContextType } from '@/providers/AppSettingProvider';

import { Switch } from '../ui/switch';
import Typography from '../typography/Typography';

const TABLE_BORDER_TOGGLE_TEXT = {
  horizontal: 'Table Row Borders',
  vertical: 'Table Column Borders',
} as const;

interface Props {
  direction: keyof typeof TABLE_BORDER_TOGGLE_TEXT;
}

/**
 * Switch for showing or hiding table borders in one direction. The value is persisted in a cookie
 * and applied to every table through a `<body>` data attribute (see `components/ui/table.tsx`).
 */
export default function ThemeAndMoreTableBorderToggle({ direction }: Props) {
  const { showTableHorizontalBorders, setShowTableHorizontalBorders, showTableVerticalBorders, setShowTableVerticalBorders }: AppSettingContextType =
    useAppSetting();
  const isHorizontal = direction === 'horizontal';
  const checked = isHorizontal ? showTableHorizontalBorders : showTableVerticalBorders;
  const onCheckedChange = isHorizontal ? setShowTableHorizontalBorders : setShowTableVerticalBorders;
  const Icon = isHorizontal ? Rows3 : Columns3;

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
        <Icon className="size-4" />
        { TABLE_BORDER_TOGGLE_TEXT[direction] }
      </Typography>
      <Switch checked={ checked } onCheckedChange={ onCheckedChange } />
    </DropdownMenuItem>
  );
}
