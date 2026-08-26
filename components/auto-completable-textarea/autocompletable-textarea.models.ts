import { ReactNode } from 'react';

import { ChipMenuItemConfig, ItemDisplayFunction, RenderItemDetails } from '@/components/auto-completable-shared/autocompletable-shared.models';

/**
 * A plain text chunk the user typed themselves inside the text area.
 */
export interface AutoCompleteTextSegment {
  kind: 'text';
  text: string;
}

/**
 * An "autocompleted item": an item that was selected from the dropdown list and
 * auto-filled into the text area. It is rendered as a chip (Gmail style) instead of plain text.
 * `chipId` is a unique id generated at insert time so the same item can be inserted multiple times.
 */
export interface AutoCompleteItemSegment<T> {
  kind: 'item';
  chipId: string;
  item: T;
}

export type AutoCompleteSegment<T> = AutoCompleteTextSegment | AutoCompleteItemSegment<T>;

/**
 * The value of the AutoCompletableTextArea: an ordered mix of typed text and autocompleted items.
 * This is what flows through react-hook-form / onChange. Use the helpers in
 * `autocompletable-textarea.utils.ts` to turn it into a plain string (for display or for the server).
 */
export type AutoCompleteValue<T> = AutoCompleteSegment<T>[];

/**
 * Everything a chip menu item's `onSelect` callback receives. The built-in actions
 * (edit / show details / remove) are exposed as callbacks so custom menu items can reuse them,
 * or completely ignore them and do their own thing with `item`.
 */
export interface AutoCompleteChipMenuContext<T> {
  /** The item this chip represents. */
  item: T;
  /** Unique id of this chip instance inside the text area. */
  chipId: string;
  /** The item's "real" text — what `itemTransformFunction` returned (e.g. the id). */
  itemServerText: string;
  /** The item's displayed text — what `itemDisplayFunction` returned (the chip label). */
  itemDisplayText: string;
  /** Writes arbitrary text to the clipboard. Resolves once the write completed. */
  copyText: (text: string) => Promise<void>;
  /** Re-opens the dropdown list anchored at this chip so the user can pick a different item. */
  startEdit: () => void;
  /** Opens the shared details dialog for this chip's item. */
  showDetails: () => void;
  /** Removes this chip from the text area. */
  removeChip: () => void;
}

/**
 * One entry of the popover menu shown when an autocompleted item (chip) is clicked.
 * The menu is fully composable: pass your own array via the `chipMenuItems` prop to add,
 * remove or reorder options. Defaults live in `AutoCompleteChipMenu.tsx`.
 *
 * The shape comes from the shared `ChipMenuItemConfig`; the context stays this component's own,
 * so these entries only ever see editable-text-area actions (edit / show details / remove).
 */
export type AutoCompleteChipMenuItemConfig<T> = ChipMenuItemConfig<AutoCompleteChipMenuContext<T>>;

/**
 * Where the caret-anchored dropdown should be positioned, relative to the component wrapper.
 */
export interface AutoCompleteAnchorPosition {
  left: number;
  top: number;
  height: number;
}

/**
 * Props for the controlled AutoCompletableTextArea. `T` is the shape of the list items —
 * the component itself knows nothing about it, everything item-specific comes in through
 * the callback props, which keeps it droppable into any codebase with any object shape.
 */
export interface AutoCompletableTextAreaProps<T> {
  /** Full list of selectable items. All local — no remote search, no pagination. */
  items: T[];
  /** Controlled value (mix of text and autocompleted items). Works with react-hook-form's `field.value`. */
  value: AutoCompleteValue<T>;
  /** Controlled change callback. Works with react-hook-form's `field.onChange`. */
  onValueChange: (value: AutoCompleteValue<T>) => void;
  /** Filter callback used by the dropdown's search inbox. Return true to keep the item. */
  filterFunction: (item: T, filter: string) => boolean;
  /** Returns the text shown inside the chip once an item is autocompleted into the text area. */
  itemDisplayFunction: ItemDisplayFunction<T>;
  /**
   * Serializes an autocompleted item to its "real" text (e.g. `item => item.id`).
   * Used when copying/cutting text-area content to the clipboard — chips are copied as this text —
   * and to recognize item ids inside an incoming value (see `getItemIdPrefix`).
   * Falls back to `itemDisplayFunction` when omitted.
   */
  itemTransformFunction?: (item: T) => string;
  /**
   * Returns the prefix every item id (the `itemTransformFunction` output) starts with, e.g. 'GIST-'.
   * When provided, incoming values (initial value, form resets) and the content on every blur of
   * the text area are scanned for the prefix, and any matching item id found in plain text
   * (typed or pasted) is swapped into an autocompleted item chip. The prefix keeps
   * the scan cheap: only prefix occurrences are candidate positions, instead of matching every id at
   * every character of the text. Omit to disable hydration.
   */
  getItemIdPrefix?: (item: T) => string;
  /** Renders one row of the dropdown list. Falls back to `itemDisplayFunction` text when omitted. */
  renderItemOption?: (item: T) => ReactNode;
  /**
   * Marks an item as not selectable. Return true and its dropdown row is rendered disabled: it
   * cannot be clicked or chosen with Enter, and the arrow-key navigation skips over it.
   * Omit to leave every item selectable.
   */
  isItemDisabled?: (item: T) => boolean;
  /** Renders the body of the "Show details" dialog. Falls back to a generic key/value dump when omitted. */
  renderItemDetails?: RenderItemDetails<T>;
  /** Title of the "Show details" dialog. */
  detailsDialogTitle?: ReactNode;
  /** Keyboard key that opens the dropdown at the caret (e.g. ':', '?', '+', '@'). Defaults to ':'. */
  triggerKey?: string;
  /** Tailwind classes for the text area surface. */
  className?: string;
  /** Tailwind classes for each dropdown select item. */
  selectItemClassName?: string;
  /** Tailwind classes for the autocompleted item chip. */
  chipClassName?: string;
  /** Placeholder text shown when the text area is empty. */
  placeholder?: string;
  /** Placeholder of the dropdown's search inbox. */
  searchPlaceholder?: string;
  /** Text shown when the filter matches nothing. */
  emptyText?: string;
  /** Disables typing and chip interactions. */
  disabled?: boolean;
  /**
   * Shows the content as-is: the automatic id scan is turned off, so raw text stays raw text
   * instead of being converted into chips. Affects BOTH scan passes — the incoming value
   * (initial value, form resets) and the one on blur. Picking from the dropdown also inserts the
   * item's `itemTransformFunction` text as PLAIN TEXT rather than a chip, so while the flag is on
   * nothing on screen is a chip and the underlying value is exactly what you see.
   * The flag is REACTIVE: toggling it converts the current content in place, both ways. Switching
   * it ON flattens existing chips back into the raw text they represent; switching it OFF scans raw
   * ids back into chips. The conversion is lossless for the submitted string (a chip's raw text is
   * its `itemTransformFunction` output), but it does emit a new value, which dirties a
   * react-hook-form field. Un-chipping needs `itemTransformFunction`; re-chipping additionally
   * needs `getItemIdPrefix`.
   */
  showOriginal?: boolean;
  /**
   * Shows a clear ("X") button in the top right corner that wipes all content. Defaults to true.
   * The cleared value is emitted through the normal change callback, so react-hook-form (controlled)
   * and the uncontrolled variant's `onChange` both see it.
   */
  showClearButton?: boolean;
  /** Tailwind classes for the clear button, e.g. to reposition it. */
  clearButtonClassName?: string;
  /** Overrides the chip popover menu entries. Defaults to Edit / Show details / Remove. */
  chipMenuItems?: AutoCompleteChipMenuItemConfig<T>[];
  /** Blur callback, e.g. react-hook-form's `field.onBlur`. */
  onBlur?: () => void;
  id?: string;
}
