'use client';

import { ChevronDownIcon, TriangleAlertIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';

import { copyTextToClipboard } from './autocompletable-textarea-read-only.utils';
import {
  AutoCompleteReadOnlyChipMenuContext,
  AutoCompleteReadOnlyChipMenuItemConfig,
} from './autocompletable-textarea-read-only.models';

interface AutoCompleteReadOnlyChipProps<T> {
  /** The resolved item, or undefined when the matched id is unknown. */
  item: T | undefined;
  /** The raw text that matched the regex (the id). */
  matchedText: string;
  /** What the chip shows. */
  displayText: string;
  /** The item's content, used by the "Copy content" entry. */
  contentText: string | undefined;
  /** Menu entries — composable, see `AutoCompleteReadOnlyChipMenu.tsx`. */
  menuItems: AutoCompleteReadOnlyChipMenuItemConfig<T>[];
  className?: string;
  /** Extra classes applied only when the id could not be resolved. */
  unresolvedClassName?: string;
  onViewDetails: (item: T) => void;
}

/**
 * A read-only chip: a matched id rendered as a clickable pill that opens a menu.
 *
 * Deliberately its own component rather than a mode of the editable text area's chip — that one
 * carries editing concerns (contentEditable hosting, caret behavior, Edit/Remove) that mean
 * nothing here, and folding both into one component would trade readability for reuse.
 *
 * An unresolvable id keeps its chip but is marked with a warning triangle and muted styling, so a
 * stale id is visible rather than silently blending into the surrounding text.
 */
export default function AutoCompleteReadOnlyChip<T>({
  item,
  matchedText,
  displayText,
  contentText,
  menuItems,
  className,
  unresolvedClassName,
  onViewDetails,
}: AutoCompleteReadOnlyChipProps<T>) {
  const isUnresolved = item === undefined;

  const menuContext: AutoCompleteReadOnlyChipMenuContext<T> = {
    item: item,
    matchedText: matchedText,
    displayText: displayText,
    contentText: contentText,
    copyText: copyTextToClipboard,
    viewDetails: () => {
      if (item !== undefined) {
        onViewDetails(item);
      }
    },
  };

  return (
    <DropdownMenu modal={ false }>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={ matchedText }
          className={ cn(
            `
              mx-0.5 inline-flex cursor-pointer items-center gap-x-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-px
              align-baseline transition-colors select-none
              hover:bg-primary/20
              focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none
              data-[state=open]:bg-primary/20
            `,
            // Unresolved styling sits before the caller's classes so a passed-in border/background
            // still wins through tailwind-merge.
            isUnresolved && `
              border-dashed border-amber-600 bg-amber-500/10 text-amber-800
              hover:bg-amber-500/20
              data-[state=open]:bg-amber-500/20
              dark:border-amber-500 dark:text-amber-300
            `,
            className,
            isUnresolved && unresolvedClassName,
          ) }
        >
          { isUnresolved ?
            <TriangleAlertIcon aria-hidden className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          : null }
          <Typography variant="span1">{ displayText }</Typography>
          <ChevronDownIcon className="size-3 shrink-0 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={ 4 }>
        { menuItems.map((menuItem: AutoCompleteReadOnlyChipMenuItemConfig<T>) => {
          return (
            <DropdownMenuItem
              key={ menuItem.key }
              variant={ menuItem.destructive ? 'destructive' : 'default' }
              disabled={ menuItem.isDisabled?.({ item, matchedText, displayText, contentText }) ?? false }
              onSelect={ () => menuItem.onSelect(menuContext) }
            >
              { menuItem.icon }
              { menuItem.label }
            </DropdownMenuItem>
          );
        }) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
