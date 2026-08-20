/* eslint-disable react/no-array-index-key */
'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Command, CommandList, CommandItem, CommandInput, CommandEmpty } from '@/components/ui/command';

import { AutoCompleteAnchorPosition } from './autocompletable-textarea.models';

interface AutoCompleteDropdownProps<T> {
  /** Where to anchor the dropdown, relative to the (position: relative) wrapper it is rendered in. */
  anchorPosition: AutoCompleteAnchorPosition;
  /** Full list of selectable items — filtering is 100% local. */
  items: T[];
  /** Filter callback driven by the search inbox on top of the list. */
  filterFunction: (item: T, filter: string) => boolean;
  /** Renders one row of the list. */
  renderItemOption: (item: T) => ReactNode;
  /** Returns true for items that cannot be selected — their row renders disabled. */
  isItemDisabled?: (item: T) => boolean;
  /** Tailwind classes applied to each select item row. */
  selectItemClassName?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Fired on click or Enter on the highlighted item. */
  onSelect: (item: T) => void;
  /** Fired on Escape / click outside. */
  onClose: () => void;
}

/**
 * The caret-anchored dropdown: a search inbox on top, a scrollable filtered list below.
 * Built on cmdk (shadcn Command) so ArrowUp/ArrowDown/Enter keyboard navigation works out of
 * the box while focus stays inside the search inbox, which is auto-focused on open.
 */
export default function AutoCompleteDropdown<T>({
  anchorPosition,
  items,
  filterFunction,
  renderItemOption,
  isItemDisabled,
  selectItemClassName,
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  onSelect,
  onClose,
}: AutoCompleteDropdownProps<T>) {
  // The dropdown is mounted fresh on every trigger, so the search inbox always starts empty.
  const [filter, setFilter] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Focus the search inbox right away so the user can start filtering immediately. The delayed
  // call wins over focus juggling from whatever closed just before (e.g. the chip's Edit menu).
  useEffect(() => {
    const timeoutId = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredItems: T[] = filter.trim() === '' ? items : items.filter((item: T) => filterFunction(item, filter));

  return (
    <Popover
      open={ true }
      onOpenChange={ (open: boolean) => {
        if (!open) {
          onClose();
        }
      } }
    >
      <PopoverAnchor asChild>
        <span
          aria-hidden
          className="pointer-events-none absolute w-px"
          style={ { left: anchorPosition.left, top: anchorPosition.top, height: anchorPosition.height } }
        />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={ 4 }
        className="w-80 p-0"
        onOpenAutoFocus={ (event) => event.preventDefault() }
        onCloseAutoFocus={ (event) => event.preventDefault() }
        onFocusOutside={ (event) => event.preventDefault() }
      >
        { /* shouldFilter is off: filtering goes through the composable filterFunction prop instead of cmdk's built-in scoring. */ }
        <Command shouldFilter={ false }>
          <CommandInput ref={ searchInputRef } autoFocus placeholder={ searchPlaceholder } value={ filter } onValueChange={ setFilter } />
          { /* p-2 gives the rows breathing room from the popover edges (their hover/selected
               background is rounded, so it needs a gutter on both sides). */ }
          <CommandList className="max-h-120 p-2">
            <CommandEmpty>{ emptyText }</CommandEmpty>
            { filteredItems.map((item: T, index: number) => {
              // cmdk both blocks the click/Enter and skips the row during arrow navigation when
              // `disabled` is set; the onSelect guard keeps that true for any future custom row.
              const disabled = isItemDisabled?.(item) ?? false;

              return (
                <CommandItem
                  key={ index }
                  value={ String(index) }
                  disabled={ disabled }
                  className={ cn('px-3 py-2', disabled ? 'cursor-not-allowed' : 'cursor-pointer', selectItemClassName) }
                  onSelect={ () => {
                    if (!disabled) {
                      onSelect(item);
                    }
                  } }
                >
                  { renderItemOption(item) }
                </CommandItem>
              );
            }) }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
