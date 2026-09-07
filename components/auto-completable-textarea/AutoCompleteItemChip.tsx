'use client';

import { ChevronDownIcon, TriangleAlertIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';

import { copyTextToClipboard } from '@/components/auto-completable-shared/autocompletable-shared.utils';

import { AUTOCOMPLETE_CHIP_ID_ATTRIBUTE } from './autocompletable-textarea.utils';
import { AutoCompleteChipMenuContext, AutoCompleteChipMenuItemConfig } from './autocompletable-textarea.models';

interface AutoCompleteItemChipProps<T> {
  chipId: string;
  item: T;
  /** Text shown inside the chip — result of the `itemDisplayFunction` prop. */
  label: string;
  /** The item's "real" text — result of the `itemTransformFunction` prop (e.g. the id). */
  serverText: string;
  /**
   * True when the text area's `isItemDisabled` callback rejects this chip's item — the item is no
   * longer selectable, but a chip for it can still exist (hydrated from text, or disabled after
   * it was picked). The chip then warns instead of hiding the problem: a triangle icon and an
   * amber border. The chip stays clickable so the menu can still Edit or Remove it.
   */
  isItemDisabled?: boolean;
  /** Tailwind classes to restyle the chip. */
  className?: string;
  disabled?: boolean;
  /** Popover menu entries — composable, see `AutoCompleteChipMenu.tsx`. */
  menuItems: AutoCompleteChipMenuItemConfig<T>[];
  onStartEdit: (chipId: string) => void;
  onShowDetails: (chipId: string) => void;
  onRemove: (chipId: string) => void;
}

/**
 * An autocompleted item rendered inside the text area, Gmail-recipient style: visually distinct
 * from typed text (bordered pill) so users can tell it was auto-filled.
 * Clicking it opens a popover menu (Edit / Show details / Remove by default).
 *
 * The wrapper span is contentEditable={false} so the browser treats the whole chip as one
 * atomic unit — the caret skips over it and Backspace deletes it in one keystroke.
 */
export default function AutoCompleteItemChip<T>({
  chipId,
  item,
  label,
  serverText,
  isItemDisabled,
  className,
  disabled,
  menuItems,
  onStartEdit,
  onShowDetails,
  onRemove,
}: AutoCompleteItemChipProps<T>) {
  // Context handed to every menu item so custom entries can reuse the built-in actions.
  const menuContext: AutoCompleteChipMenuContext<T> = {
    item: item,
    chipId: chipId,
    itemServerText: serverText,
    itemDisplayText: label,
    copyText: copyTextToClipboard,
    startEdit: () => onStartEdit(chipId),
    showDetails: () => onShowDetails(chipId),
    removeChip: () => onRemove(chipId),
  };

  return (
    <span contentEditable={ false } suppressContentEditableWarning { ...{ [AUTOCOMPLETE_CHIP_ID_ATTRIBUTE]: chipId } } className="inline-block align-baseline">
      { /* modal={false} keeps the menu from trapping focus, so the Edit dropdown's search inbox
           can grab focus the moment the menu closes. */ }
      <DropdownMenu modal={ false }>
        <DropdownMenuTrigger asChild disabled={ disabled }>
          <button
            type="button"
            className={ cn(
              `
                mx-0.5 inline-flex cursor-pointer items-center gap-x-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-px
                align-baseline transition-colors select-none
                hover:bg-primary/20
                focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none
                data-[state=open]:bg-primary/20
              `,
              // Warning look for a disabled item. Listed before `className` on purpose: tailwind-merge
              // keeps the LAST conflicting utility, so a border/bg passed via chipClassName wins.
              isItemDisabled && `
                border-amber-600 bg-amber-500/10 text-amber-800
                hover:bg-amber-500/20
                data-[state=open]:bg-amber-500/20
                dark:border-amber-500 dark:text-amber-300
              `,
              className,
            ) }
          >
            { isItemDisabled ?
              <TriangleAlertIcon aria-hidden className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            : null }
            <Typography variant="span1">{ label }</Typography>
            <ChevronDownIcon className="size-3 shrink-0 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        { /* onCloseAutoFocus is prevented so closing the menu doesn't yank focus back to the chip —
             that focus-return would instantly dismiss the Edit dropdown as an "outside focus". */ }
        { /* z-[200] clears the dialog layer (z-150 in components/ui/dialog.tsx): Radix copies the
             content's z-index onto the popper wrapper it portals to <body>, and the shadcn default
             of z-50 leaves the menu painted UNDERNEATH a dialog the text area sits in — present in
             the DOM, invisible and unclickable. Same value ui/select.tsx already uses for this. */ }
        <DropdownMenuContent className="z-[200]" align="start" sideOffset={ 4 } onCloseAutoFocus={ (event) => event.preventDefault() }>
          { menuItems.map((menuItem: AutoCompleteChipMenuItemConfig<T>) => {
            return (
              <DropdownMenuItem
                key={ menuItem.key }
                variant={ menuItem.destructive ? 'destructive' : 'default' }
                onSelect={ () => menuItem.onSelect(menuContext) }
              >
                { menuItem.icon }
                { menuItem.label }
              </DropdownMenuItem>
            );
          }) }
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}
