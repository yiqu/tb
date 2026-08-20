'use client';

import toast from 'react-hot-toast';
import { EyeIcon, CopyIcon, FileTextIcon } from 'lucide-react';

import { AutoCompleteReadOnlyChipMenuContext, AutoCompleteReadOnlyChipMenuItemConfig } from './autocompletable-textarea-read-only.models';

/**
 * Copies text and shows the app's standard "Copied." toast.
 * The toast lives here, in the swappable defaults, rather than in the shared util — so another
 * codebase can supply its own `chipMenuItems` without inheriting this app's toast library.
 */
const copyWithToast = async <T,>(context: AutoCompleteReadOnlyChipMenuContext<T>, text: string) => {
  await context.copyText(text);
  toast.remove();
  toast.success('Copied.', { duration: 1000 });
};

/**
 * Default entries of the menu shown when a read-only chip is clicked.
 *
 * Data-driven so it stays composable:
 * - add an entry: `chipMenuItems={ [...getDefaultReadOnlyChipMenuItems(), myEntry] }`
 * - remove/reorder: build your own array; nothing here reaches into the component internals
 * - change behavior: swap an `onSelect` and use `context.item` / `context.matchedText`
 *
 * Entries needing a resolved item declare `isDisabled`, so an unknown id greys them out instead of
 * failing when picked.
 */
export function getDefaultReadOnlyChipMenuItems<T>(): AutoCompleteReadOnlyChipMenuItemConfig<T>[] {
  return [
    {
      key: 'view-details',
      label: 'View details',
      icon: <EyeIcon />,
      isDisabled: (context) => context.item === undefined,
      // Opens the details dialog with everything about this item.
      onSelect: (context) => context.viewDetails(),
    },
    {
      key: 'copy',
      label: 'Copy',
      icon: <CopyIcon />,
      // Copies the item's content — whatever itemCopyContentFunction returned. Disabled when there
      // is nothing to copy (unresolved id, or no content function supplied).
      isDisabled: (context) => context.contentText === undefined,
      onSelect: (context) => copyWithToast(context, context.contentText ?? ''),
    },
    {
      key: 'copy-display',
      label: 'Copy display',
      icon: <FileTextIcon />,
      // Copies exactly what the chip shows — the itemDisplayFunction result. Never disabled: an
      // unresolved id still displays its raw matched text, which is a valid thing to copy.
      onSelect: (context) => copyWithToast(context, context.displayText),
    },
  ];
}
