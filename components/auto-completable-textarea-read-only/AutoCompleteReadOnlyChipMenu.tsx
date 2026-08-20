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
      // Copies the matched text itself — the id as it appears in the string.
      onSelect: (context) => copyWithToast(context, context.matchedText),
    },
    {
      key: 'copy-content',
      label: 'Copy content',
      icon: <FileTextIcon />,
      // Copies the item's content, per the itemCopyContentFunction prop. Disabled when there is no
      // content to copy (unresolved id, or no content function supplied).
      isDisabled: (context) => context.contentText === undefined,
      onSelect: (context) => copyWithToast(context, context.contentText ?? ''),
    },
  ];
}
