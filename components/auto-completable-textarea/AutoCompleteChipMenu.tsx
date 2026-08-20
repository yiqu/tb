'use client';

import toast from 'react-hot-toast';
import { CopyIcon, InfoIcon, Trash2Icon, PencilLineIcon, ClipboardTypeIcon } from 'lucide-react';

import { AutoCompleteChipMenuContext, AutoCompleteChipMenuItemConfig } from './autocompletable-textarea.models';

/**
 * Copies text and surfaces the app's standard "Copied." toast.
 * The toast lives here (in the swappable defaults) rather than in the shared util, so a different
 * codebase can pass its own `chipMenuItems` without inheriting this app's toast library.
 */
const copyWithToast = async <T,>(context: AutoCompleteChipMenuContext<T>, text: string) => {
  await context.copyText(text);
  toast.remove();
  toast.success('Copied.', { duration: 1000 });
};

/**
 * Default entries of the popover menu shown when an autocompleted item (chip) is clicked.
 *
 * The menu is intentionally data-driven so it stays composable and maintainable:
 * - to add an option: pass `chipMenuItems={ [...getDefaultChipMenuItems(), myItem] }` to the text area
 * - to remove/reorder options: build your own array (each entry is independent, nothing here is
 *   tied to the text area internals — the built-in behaviors are reachable through the context callbacks)
 * - to change what an option does: swap its `onSelect` and use `context.item` / `context.chipId`
 *   however you need, or call the built-ins (`startEdit`, `showDetails`, `removeChip`, `copyText`)
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
      key: 'copy',
      label: 'Copy',
      icon: <CopyIcon />,
      // Copies the item's "real" text — whatever itemTransformFunction returned (e.g. the id).
      onSelect: (context) => copyWithToast(context, context.itemServerText),
    },
    {
      key: 'copy-display',
      label: 'Copy display',
      icon: <ClipboardTypeIcon />,
      // Copies the text shown on the chip — whatever itemDisplayFunction returned.
      onSelect: (context) => copyWithToast(context, context.itemDisplayText),
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
