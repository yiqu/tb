'use client';

import { InfoIcon, Trash2Icon, PencilLineIcon } from 'lucide-react';

import { AutoCompleteChipMenuItemConfig } from './autocompletable-textarea.models';

/**
 * Default entries of the popover menu shown when an autocompleted item (chip) is clicked.
 *
 * The menu is intentionally data-driven so it stays composable and maintainable:
 * - to add an option: pass `chipMenuItems={ [...getDefaultChipMenuItems(), myItem] }` to the text area
 * - to remove/reorder options: build your own array (each entry is independent, nothing here is
 *   tied to the text area internals — the built-in behaviors are reachable through the context callbacks)
 * - to change what an option does: swap its `onSelect` and use `context.item` / `context.chipId`
 *   however you need, or call the built-ins (`startEdit`, `showDetails`, `removeChip`)
 */
export function getDefaultChipMenuItems<T>(): AutoCompleteChipMenuItemConfig<T>[] {
  return [
    {
      key: 'edit',
      label: 'Edit',
      icon: <PencilLineIcon />,
      // Re-opens the dropdown list at this chip so a different item can be selected.
      onSelect: (context) => context.startEdit(),
    },
    {
      key: 'show-details',
      label: 'Show details',
      icon: <InfoIcon />,
      // Opens the shared styled dialog with everything about this chip's item.
      onSelect: (context) => context.showDetails(),
    },
    {
      key: 'remove',
      label: 'Remove',
      icon: <Trash2Icon />,
      destructive: true,
      // Deletes the chip from the text area.
      onSelect: (context) => context.removeChip(),
    },
  ];
}
